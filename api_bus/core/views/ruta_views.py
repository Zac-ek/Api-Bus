from rest_framework import generics
from core.models.ruta import Ruta
from core.serializers.ruta_serializer import RutaSerializer

class RutaListCreate(generics.ListCreateAPIView):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer

class RutaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer