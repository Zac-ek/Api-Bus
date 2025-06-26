from django.db import models
from .ruta import Ruta

class Horario(models.Model):
    DIAS_CHOICES = [
        ('Lunes', 'Lunes'),
        ('Martes', 'Martes'),
        ('Miércoles', 'Miércoles'),
        ('Jueves', 'Jueves'),
        ('Viernes', 'Viernes'),
        ('Sábado', 'Sábado'),
        ('Domingo', 'Domingo'),
    ]
    
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='horarios')
    hora_salida = models.TimeField()
    hora_llegada = models.TimeField()
    dias_disponibles = models.JSONField()  # Almacena array de días
    capacidad_disponible = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.ruta.nombre} - {self.hora_salida}"