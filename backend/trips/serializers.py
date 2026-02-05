from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    id = serializers.IntegerField(source='trip_id', read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('user',)