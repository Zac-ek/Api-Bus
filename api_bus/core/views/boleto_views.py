from rest_framework import generics
from core.models.boleto import Boleto
from core.serializers.boleto_serializer import BoletoSerializer

class BoletoListCreate(generics.ListCreateAPIView):
    queryset = Boleto.objects.all()
    serializer_class = BoletoSerializer

class BoletoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Boleto.objects.all()
    serializer_class = BoletoSerializer