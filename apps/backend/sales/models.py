from django.db import models

class PharmacySalesFact(models.Model):
    # Temporal dimensions
    date = models.DateField(db_index=True)
    year = models.PositiveSmallIntegerField()
    month = models.PositiveSmallIntegerField()
    day = models.PositiveSmallIntegerField()

    # Geographic dimensions
    region = models.CharField(max_length=50, db_index=True)
    country = models.CharField(max_length=100, db_index=True)

    # Product dimensions
    category = models.CharField(max_length=50, db_index=True)
    medicine = models.CharField(max_length=100, db_index=True)

    # Demographic
    age_group = models.CharField(max_length=20, db_index=True)

    # Measures
    units_sold = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    revenue = models.DecimalField(max_digits=14, decimal_places=2)  # Derived: units_sold × unit_price
    stock_level = models.PositiveIntegerField()
    expiry_days_remaining = models.PositiveIntegerField()

    # Flags
    covid_flag = models.BooleanField()

    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Link back to the ETL job that imported this row
    etl_job = models.ForeignKey(
        'etl.ETLJob', on_delete=models.CASCADE, related_name='sales_records', null=True
    )

    class Meta:
        db_table = 'pharmacy_sales_fact'
        indexes = [
            models.Index(fields=['region', 'country']),
            models.Index(fields=['category', 'medicine']),
            models.Index(fields=['year', 'month']),
            models.Index(fields=['covid_flag']),
            models.Index(fields=['age_group']),
            models.Index(fields=['expiry_days_remaining']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['date', 'country', 'region', 'medicine', 'category', 'age_group'],
                name='unique_pharmacy_sales_fact'
            )
        ]
