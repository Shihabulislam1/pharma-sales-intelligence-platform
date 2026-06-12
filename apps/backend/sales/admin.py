from django.contrib import admin
from .models import PharmacySalesFact

@admin.register(PharmacySalesFact)
class PharmacySalesFactAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'date', 'region', 'country', 'category', 'medicine',
        'units_sold', 'revenue', 'stock_level', 'covid_flag'
    )
    list_filter = ('year', 'month', 'region', 'category', 'covid_flag')
    search_fields = ('medicine', 'country', 'region')
    readonly_fields = ('created_at', 'updated_at')
