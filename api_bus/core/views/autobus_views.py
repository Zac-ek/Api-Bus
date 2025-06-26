from rest_framework import generics
from core.models.autobus import Autobus
from core.serializers.autobus_serializer import AutobusSerializer

class AutobusListCreate(generics.ListCreateAPIView):
    queryset = Autobus.objects.all()
    serializer_class = AutobusSerializer

class AutobusRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Autobus.objects.all()
    serializer_class = AutobusSerializer