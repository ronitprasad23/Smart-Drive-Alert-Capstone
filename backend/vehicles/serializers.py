from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    user_details = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('user',)
