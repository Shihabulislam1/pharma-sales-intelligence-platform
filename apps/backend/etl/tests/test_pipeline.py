import os
import pandas as pd
from django.test import TestCase
from etl.services.pipeline import ETLPipeline
from etl.models import ETLJob
from sales.models import PharmacySalesFact

class PipelineTests(TestCase):
    def setUp(self):
        self.csv_path = 'test_data.csv'
        data = {
            'date': ['2025-10-12', '2025-10-12'],
            'year': [2025, 2025],
            'month': [10, 10],
            'day': [12, 12],
            'region': ['middle east', 'Middle East'],
            'country': ['UAE', 'uae'],
            'category': ['chronic', 'Chronic'],
            'medicine': [' amlodipine ', 'Amlodipine'],
            'age_group': ['0-12', '0-12'],
            'units_sold': [10, -5],  # One invalid
            'unit_price': [5.0, 5.0],
            'stock_level': [100, 100],
            'expiry_days_remaining': [300, 300],
            'covid_flag': [0, 0]
        }
        pd.DataFrame(data).to_csv(self.csv_path, index=False)
        self.etl_job = ETLJob.objects.create(file_name='test_data.csv', status='PENDING')

    def tearDown(self):
        if os.path.exists(self.csv_path):
            os.remove(self.csv_path)

    def test_pipeline_cleaning_and_validation(self):
        pipeline = ETLPipeline()
        completed_job = pipeline.run(self.csv_path, self.etl_job)
        
        self.assertEqual(completed_job.status, ETLJob.Status.COMPLETED)
        self.assertEqual(completed_job.total_rows, 2)
        self.assertEqual(completed_job.invalid_rows, 1)  # the one with -5 units_sold
        self.assertEqual(completed_job.valid_rows, 1)
        
        record = PharmacySalesFact.objects.first()
        self.assertEqual(record.region, 'Middle East')
        self.assertEqual(record.country, 'Uae')
        self.assertEqual(record.medicine, 'Amlodipine')
        self.assertEqual(record.revenue, 50.0) # 10 * 5.0
