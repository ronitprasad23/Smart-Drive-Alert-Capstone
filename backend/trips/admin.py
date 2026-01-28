from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'start_time', 'distance_km')
    list_filter = ('status', 'start_time')
    search_fields = ('user__username', 'start_location', 'end_location')
