from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from sales.models import PharmacySalesFact

class AnalyticsViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create dummy data
        PharmacySalesFact.objects.create(
            date='2020-01-01', year=2020, month=1, day=1,
            region='North America', country='USA',
            category='Antibiotic', medicine='Amoxicillin', age_group='13-25',
            units_sold=100, unit_price=10.0, revenue=1000.0,
            stock_level=50, expiry_days_remaining=10, covid_flag=1
        )
        PharmacySalesFact.objects.create(
            date='2021-01-01', year=2021, month=1, day=1,
            region='Europe', country='UK',
            category='Vitamin', medicine='Vitamin C', age_group='26-45',
            units_sold=200, unit_price=5.0, revenue=1000.0,
            stock_level=5000, expiry_days_remaining=400, covid_flag=0
        )

    def test_kpi_dashboard(self):
        response = self.client.get(reverse('kpi-dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_revenue'], 2000.0)
        self.assertEqual(response.data['total_units_sold'], 300)
        self.assertEqual(response.data['total_medicines'], 2)

    def test_revenue_analytics(self):
        response = self.client.get(reverse('revenue-analytics') + '?group_by=region')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 2)
        self.assertEqual(response.data['group_by'], 'region')

    def test_inventory_analytics_low_stock(self):
        response = self.client.get(reverse('inventory-analytics') + '?view=low_stock&threshold=100')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['medicine'], 'Amoxicillin')

    def test_expiry_analytics(self):
        response = self.client.get(reverse('expiry-analytics') + '?days=30')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_at_risk_records'], 1)
        
    def test_demographic_analytics(self):
        response = self.client.get(reverse('demographic-analytics'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 2)

    def test_covid_analytics(self):
        response = self.client.get(reverse('covid-analytics'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 1)
