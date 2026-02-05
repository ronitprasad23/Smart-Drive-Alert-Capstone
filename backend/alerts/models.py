from django.db import models
from django.conf import settings

class Alert(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class TripAlert(models.Model):
    SEVERITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trip_alerts')
    trip = models.ForeignKey('trips.Trip', on_delete=models.CASCADE, related_name='trip_alerts', null=True, blank=True)
    alert_type = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='trip_alerts')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MEDIUM')
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Trip Alert"
        verbose_name_plural = "Trip Alerts"

    def __str__(self):
        return f"{self.alert_type.name} ({self.severity}) - {self.user.username}"