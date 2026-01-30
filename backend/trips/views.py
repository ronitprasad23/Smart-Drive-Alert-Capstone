from rest_framework import viewsets, permissions, mixins
from .models import Trip
from .serializers import TripSerializer

class TripViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = TripSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

class AdminTripViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = (permissions.IsAdminUser,)
