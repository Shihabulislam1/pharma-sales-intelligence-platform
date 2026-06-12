from django.urls import path
from .views import (
    KPIDashboardView,
    RevenueAnalyticsView,
    InventoryAnalyticsView,
    ExpiryAnalyticsView,
    DemographicAnalyticsView,
    CovidAnalyticsView
)

urlpatterns = [
    path('kpis/', KPIDashboardView.as_view(), name='kpi-dashboard'),
    path('revenue/', RevenueAnalyticsView.as_view(), name='revenue-analytics'),
    path('inventory/', InventoryAnalyticsView.as_view(), name='inventory-analytics'),
    path('expiry/', ExpiryAnalyticsView.as_view(), name='expiry-analytics'),
    path('age-groups/', DemographicAnalyticsView.as_view(), name='demographic-analytics'),
    path('covid/', CovidAnalyticsView.as_view(), name='covid-analytics'),
]
