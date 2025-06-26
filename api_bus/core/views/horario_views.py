from rest_framework import generics
from core.models.horario import Horario
from core.serializers.horario_serializer import HorarioSerializer

class HorarioListCreate(generics.ListCreateAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer

class HorarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer