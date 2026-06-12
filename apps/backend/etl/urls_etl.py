from django.urls import path
from .views import ETLJobListView, ETLJobDetailView

urlpatterns = [
    path('', ETLJobListView.as_view(), name='etl-job-list'),
    path('<int:pk>/', ETLJobDetailView.as_view(), name='etl-job-detail'),
]
