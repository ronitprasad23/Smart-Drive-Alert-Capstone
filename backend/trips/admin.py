from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'user', 'status', 'start_time', 'distance_km')
    list_filter = ('status', 'start_time')
    search_fields = ('user__username', 'start_location', 'end_location')
    readonly_fields = [field.name for field in Trip._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

