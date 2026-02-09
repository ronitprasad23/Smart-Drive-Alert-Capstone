from django.db import models
from django.conf import settings

class Alert(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class TripAlert(models.Model):
    SEVERITY_CHOICES = (
        ('MINOR_RISK', 'Minor Risk'),
        ('MODERATE_RISK', 'Moderate Risk'),
        ('CRITICAL_RISK', 'Critical Risk'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trip_alerts')
    trip = models.ForeignKey('trips.Trip', on_delete=models.CASCADE, related_name='trip_alerts', null=True, blank=True)
    alert_type = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='trip_alerts')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MODERATE_RISK')
    vehicle_speed = models.FloatField(null=True, blank=True, help_text="Speed in km/h")
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.vehicle_speed is not None:
            if self.vehicle_speed >= 100:
                self.severity = 'CRITICAL_RISK'
            elif self.vehicle_speed >= 60:
                self.severity = 'MODERATE_RISK'
            else:
                self.severity = 'MINOR_RISK'
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Trip Alert"
        verbose_name_plural = "Trip Alerts"

    def __str__(self):
        return f"{self.alert_type.name} ({self.severity}) - {self.user.username}"