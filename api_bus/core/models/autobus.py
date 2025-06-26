from django.db import models
from .trabajador import Trabajador

class Autobus(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('mantenimiento', 'En mantenimiento'),
        ('fuera_servicio', 'Fuera de servicio'),
    ]
    
    placa = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=50)
    anio = models.PositiveIntegerField()
    capacidad = models.PositiveIntegerField()
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='activo')
    conductor = models.ForeignKey(Trabajador, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'puesto': 'conductor'})
    
    def __str__(self):
        return f"{self.placa} - {self.modelo}"