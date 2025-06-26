from rest_framework import generics
from core.models.trabajador import Trabajador
from core.serializers.trabajador_serializer import TrabajadorSerializer

class TrabajadorListCreate(generics.ListCreateAPIView):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer

class TrabajadorRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer