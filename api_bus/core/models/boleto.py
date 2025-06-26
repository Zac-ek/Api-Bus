from django.db import models
from .usuario import Usuario
from .ruta import Ruta
from .autobus import Autobus
from .horario import Horario

class Boleto(models.Model):
    ESTADO_CHOICES = [
        ('reservado', 'Reservado'),
        ('cancelado', 'Cancelado'),
        ('completado', 'Completado'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='boletos')
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE)
    autobus = models.ForeignKey(Autobus, on_delete=models.CASCADE)
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE)
    fecha_reservacion = models.DateTimeField(auto_now_add=True)
    fecha_viaje = models.DateField()
    asiento_numero = models.PositiveIntegerField()
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='reservado')
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ('autobus', 'fecha_viaje', 'asiento_numero', 'horario')
    
    def __str__(self):
        return f"Boleto #{self.id} - {self.usuario.persona.nombre}"