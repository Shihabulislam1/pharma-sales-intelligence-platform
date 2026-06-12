from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import ScopedRateThrottle
from .models import ETLJob
from .serializers import ETLJobSerializer, FileUploadSerializer
from .services.pipeline import ETLPipeline

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'uploads'

    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            if not isinstance(validated_data, dict):
                return Response({"error": "Invalid payload"}, status=status.HTTP_400_BAD_REQUEST)
            file_obj = validated_data.get('file')
            
            # Create ETLJob with pending status and Cloudinary upload
            etl_job = ETLJob.objects.create(
                file_name=file_obj.name,
                file=file_obj,
                status=ETLJob.Status.PENDING
            )
            
            # Set Cloudinary URL explicitly if using cloudinary_storage
            if etl_job.file and hasattr(etl_job.file, 'url'):
                etl_job.cloudinary_url = etl_job.file.url
                etl_job.save()

            # Run pipeline synchronously for MVP
            pipeline = ETLPipeline()
            # If Cloudinary URL exists, use that. Otherwise, use file.
            source = etl_job.cloudinary_url if etl_job.cloudinary_url else etl_job.file
            etl_job = pipeline.run(source, etl_job)

            return Response(
                ETLJobSerializer(etl_job).data,
                status=status.HTTP_201_CREATED if etl_job.status == ETLJob.Status.COMPLETED else status.HTTP_400_BAD_REQUEST
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ETLJobListView(generics.ListAPIView):
    queryset = ETLJob.objects.all()
    serializer_class = ETLJobSerializer

class ETLJobDetailView(generics.RetrieveAPIView):
    queryset = ETLJob.objects.all()
    serializer_class = ETLJobSerializer
