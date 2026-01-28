from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('alert_type', 'severity', 'user', 'timestamp', 'is_resolved')
    list_filter = ('severity', 'is_resolved', 'alert_type')
    search_fields = ('user__username', 'location')
