from rest_framework import viewsets, permissions, mixins
from .models import Alert
from .serializers import AlertSerializer

class UserAlertViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = AlertSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)

class AdminAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = (permissions.IsAdminUser,)
