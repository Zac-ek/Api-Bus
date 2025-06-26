from django.db import models
from .autobus import Autobus

class Ruta(models.Model):
    nombre = models.CharField(max_length=100)
    punto_inicio = models.CharField(max_length=100)
    punto_final = models.CharField(max_length=100)
    distancia_km = models.DecimalField(max_digits=6, decimal_places=2)
    tiempo_estimado = models.DurationField()
    autobus_asignado = models.ForeignKey(Autobus, on_delete=models.SET_NULL, null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.nombre} ({self.punto_inicio} - {self.punto_final})"