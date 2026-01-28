from django.db import models
from django.conf import settings

class Trip(models.Model):
    STATUS_CHOICES = (
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    vehicle = models.ForeignKey('vehicles.Vehicle', on_delete=models.SET_NULL, null=True, related_name='trips')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    start_location = models.CharField(max_length=255, blank=True)
    end_location = models.CharField(max_length=255, blank=True)
    distance_km = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ONGOING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id} - {self.user.username} ({self.status})"
