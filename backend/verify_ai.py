import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_drive.settings')
django.setup()

from accounts.models import User
from trips.models import Trip
from vehicles.models import Vehicle
from alerts.models import TripAlert
from analytics.ai_service import generate_safety_feedback
from django.utils import timezone
from datetime import timedelta

def verify_ai():
    print("--- 1. Fetching Latest Trip Data ---")
    
    # Fetch the most recent trip
    trip = Trip.objects.last()
    
    if not trip:
        print("No trips found in the database! Please create some data via the frontend first.")
        return

    print(f"Found Trip ID: {trip.id}")
    print(f"User: {trip.user.username}")
    print(f"Distance: {trip.distance_km} km")
    print(f"Date: {trip.start_time.strftime('%Y-%m-%d %H:%M') if trip.start_time else 'N/A'}")

    # Fetch associated alerts
    alerts = trip.trip_alerts.all()
    print(f"Found {alerts.count()} alerts for this trip.")
    
    for alert in alerts:
        print(f" - {alert.alert_type} ({alert.severity})")

    print("\n--- 2. Calling AI Service (Google Gemini) ---")
    try:
        feedback = generate_safety_feedback(trip, trip.trip_alerts.all())
        print("\n=== AI FEEDBACK RESULT ===")
        print(feedback)
        print("==========================")
    except Exception as e:
        print(f"\n!!! ERROR: {e}")

if __name__ == '__main__':
    verify_ai()
