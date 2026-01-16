import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

from accounts.models import User
from trips.models import Trip
from vehicles.models import Vehicle
from alerts.models import Alert
from analytics.ai_service import generate_safety_feedback
from django.utils import timezone
from datetime import timedelta

def verify_ai():
    print("--- 1. Setting up Test Data ---")
    # Create or get a test user
    user, created = User.objects.get_or_create(username='ai_tester', defaults={'email': 'test@example.com'})
    print(f"User: {user.username}")

    # Create dummy vehicle
    vehicle, _ = Vehicle.objects.get_or_create(user=user, license_plate='AI-TEST-99', defaults={'make': 'Tesla', 'model': 'Model S', 'year': 2024})

    # Create dummy trip
    trip = Trip.objects.create(
        user=user,
        vehicle=vehicle,
        start_time=timezone.now() - timedelta(hours=2),
        end_time=timezone.now(),
        distance_km=150.5,
        status='COMPLETED'
    )
    print(f"Created Trip ID: {trip.id} (Distance: {trip.distance_km}km)")

    # Create dummy alerts (Mixed severity to test AI logic)
    Alert.objects.create(user=user, trip=trip, alert_type='Drowsiness Detected', severity='HIGH')
    Alert.objects.create(user=user, trip=trip, alert_type='Speeding', severity='LOW')
    Alert.objects.create(user=user, trip=trip, alert_type='Lane Departure', severity='MEDIUM')
    print(f"Created {trip.alerts.count()} alerts for this trip.")

    print("\n--- 2. Calling AI Service (Google Gemini) ---")
    try:
        feedback = generate_safety_feedback(trip, trip.alerts.all())
        print("\n=== AI FEEDBACK RESULT ===")
        print(feedback)
        print("==========================")
    except Exception as e:
        print(f"\n!!! ERROR: {e}")

if __name__ == '__main__':
    verify_ai()
