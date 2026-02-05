from rest_framework import viewsets, permissions
from .models import SystemSetting
from .serializers import SystemSettingSerializer

class SystemSettingViewSet(viewsets.ModelViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = (permissions.IsAdminUser,)