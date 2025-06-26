from rest_framework import serializers
from core.models.ruta import Ruta

class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ruta
        fields = '__all__'

