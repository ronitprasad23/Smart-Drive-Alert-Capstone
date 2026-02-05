from rest_framework import serializers
from .models import TripAlert, Alert

class AlertSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    alert_type = serializers.SlugRelatedField(queryset=Alert.objects.all(), slug_field='name')

    class Meta:
        model = TripAlert
        fields = '__all__'
        read_only_fields = ('user',)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if not data.get('location') and instance.trip:
            data['location'] = instance.trip.start_location or "Trip Location"
        return data

class AlertDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'