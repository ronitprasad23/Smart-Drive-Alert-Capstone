from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count
from accounts.models import User
from trips.models import Trip
from alerts.models import Alert
from .ai_service import generate_safety_feedback


# Assuming these imports might fail if I don't use the app config name or correct path.
# Apps are 'accounts', 'trips', etc. configured in INSTALLED_APPS.
# But I am in analytics app.
# I need to import models from other apps.
# 'accounts.models' should work if 'accounts' is in INSTALLED_APPS.

from accounts.models import User
from trips.models import Trip
from alerts.models import Alert

class OverviewView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # If admin, return total counts. If user, return own counts.
        if request.user.is_staff:
             data = {
                 'total_users': User.objects.count(),
                 'total_trips': Trip.objects.count(),
                 'total_alerts': Alert.objects.count(),
             }
        else:
            data = {
                'total_trips': Trip.objects.filter(user=request.user).count(),
                'total_alerts': Alert.objects.filter(user=request.user).count(),
            }
        return Response(data)

class AlertsSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        qs = Alert.objects.all()
        if not request.user.is_staff:
            qs = qs.filter(user=request.user)
        
        summary = qs.values('severity').annotate(count=Count('severity'))
        return Response(summary)

class RiskTrendsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Mocking risk trends data for the dashboard graph
        data = {
            "dates": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "risk_scores": [12, 19, 3, 5, 2, 3, 15],
            "message": "Risk trend analysis based on alert frequency per day."
        }
        return Response(data)

class TripFeedbackView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, trip_id):
        try:
            trip = Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Ensure user can only see their own trips (or admin sees all)
        if not request.user.is_staff and trip.user != request.user:
             return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        alerts = Alert.objects.filter(trip=trip)
        feedback = generate_safety_feedback(trip, alerts)
        
        return Response({
            "trip_id": trip.id,
            "analysis": feedback
        })
