import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

from alerts.models import Alert

descriptions = {
    "Drowsiness Detected": "Alert triggered when the AI detects signs of driver fatigue, such as prolonged eye closure or frequent yawning.",
    "Speeding": "Alert triggered when the vehicle's speed exceeds the safe or legal limit for the current road segment.",
    "Lane Departure": "Alert triggered when the vehicle drifts out of its lane without the turn signal being activated."
}

for name, desc in descriptions.items():
    alert, created = Alert.objects.get_or_create(name=name)
    alert.description = desc
    alert.save()
    print(f"Updated description for: {name}")

print("All descriptions updated successfully!")