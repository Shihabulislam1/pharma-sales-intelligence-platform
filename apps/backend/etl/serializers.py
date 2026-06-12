from rest_framework import serializers
from .models import ETLJob

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError('Only .csv files are accepted.')
        return value

class ETLJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ETLJob
        fields = [
            'id', 'file_name', 'cloudinary_url', 'uploaded_at', 'completed_at',
            'total_rows', 'valid_rows', 'invalid_rows', 'duplicates_removed',
            'status', 'error_message', 'notes',
        ]
