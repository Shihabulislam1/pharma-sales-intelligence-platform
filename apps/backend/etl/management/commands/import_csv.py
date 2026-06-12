import os
from django.core.management.base import BaseCommand
from etl.models import ETLJob
from etl.services.pipeline import ETLPipeline

class Command(BaseCommand):
    help = 'Import pharmacy sales data from a local CSV file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        file_path = options['file_path']
        
        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f'File not found: {file_path}'))
            return
            
        self.stdout.write(f'Importing data from {file_path}...')
        
        # Create an ETLJob record without a file (since it's local, not via API upload)
        etl_job = ETLJob.objects.create(
            file_name=os.path.basename(file_path),
            status=ETLJob.Status.PENDING,
            notes='Imported via management command'
        )
        
        pipeline = ETLPipeline()
        completed_job = pipeline.run(file_path, etl_job)
        
        if completed_job.status == ETLJob.Status.COMPLETED:
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {completed_job.valid_rows} rows.'))
            self.stdout.write(self.style.WARNING(f'Duplicates removed: {completed_job.duplicates_removed}'))
            self.stdout.write(self.style.WARNING(f'Invalid rows rejected: {completed_job.invalid_rows}'))
        else:
            self.stderr.write(self.style.ERROR(f'Import failed: {completed_job.error_message}'))
