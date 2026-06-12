from django.contrib import admin
from .models import ETLJob

@admin.register(ETLJob)
class ETLJobAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_name', 'status', 'total_rows', 'valid_rows', 'uploaded_at', 'completed_at')
    list_filter = ('status',)
    search_fields = ('file_name', 'notes')
    readonly_fields = ('uploaded_at', 'completed_at')
