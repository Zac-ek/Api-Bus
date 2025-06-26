from rest_framework import serializers
from core.models.boleto import Boleto

class BoletoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boleto
        fields = '__all__'