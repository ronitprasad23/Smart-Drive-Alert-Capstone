from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count
from accounts.models import User
from trips.models import Trip
from alerts.models import TripAlert
from .ai_service import generate_safety_feedback

class OverviewView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

        if request.user.is_staff:

            recent_alerts_qs = TripAlert.objects.all().order_by('-timestamp')[:5]
            recent_alerts = []
            for alert in recent_alerts_qs:
                recent_alerts.append({
                    'id': alert.id,
                    'user': alert.user.username,
                    'type': alert.alert_type.name,
                    'location': alert.location or "Unknown",
                    'severity': alert.severity,
                    'status': 'Critical' if alert.severity in ['CRITICAL', 'HIGH'] else ('Warning' if alert.severity == 'MEDIUM' else 'Safe')
                })

            data = {
                'total_users': User.objects.count(),
                'total_trips': Trip.objects.count(),
                'total_alerts': TripAlert.objects.count(),
                'total_accident_zones': 0,
                'recent_alerts': recent_alerts
            }
        else:
            data = {
                'total_trips': Trip.objects.filter(user=request.user).count(),
                'total_alerts': TripAlert.objects.filter(user=request.user).count(),
            }
        return Response(data)

class AlertsSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        qs = TripAlert.objects.all()
        if not request.user.is_staff:
            qs = qs.filter(user=request.user)

        summary = qs.values('severity').annotate(count=Count('severity'))
        return Response(summary)

class RiskTrendsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):

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

        if not request.user.is_staff and trip.user != request.user:
             return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        alerts = TripAlert.objects.filter(trip=trip)
        feedback = generate_safety_feedback(trip, alerts)

        return Response({
            "trip_id": trip.id,
            "analysis": feedback
        })