from rest_framework import serializers
from core.models.autobus import Autobus

class AutobusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autobus
        fields = '__all__'

