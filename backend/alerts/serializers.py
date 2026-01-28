from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ('user',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # If location is empty but trip exists, use trip's start_location
        if not data.get('location') and instance.trip:
            data['location'] = instance.trip.start_location or "Trip Location"
        return data
