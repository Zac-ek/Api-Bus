from django.db import models
from .usuario import Usuario

class Trabajador(models.Model):
    PUESTO_CHOICES = [
        ('conductor', 'Conductor'),
        ('supervisor', 'Supervisor'),
        ('mantenimiento', 'Mantenimiento'),
        ('administrativo', 'Administrativo'),
    ]
    
    TURNO_CHOICES = [
        ('matutino', 'Matutino'),
        ('vespertino', 'Vespertino'),
        ('nocturno', 'Nocturno'),
        ('mixto', 'Mixto'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='trabajador')
    puesto = models.CharField(max_length=14, choices=PUESTO_CHOICES)
    turno = models.CharField(max_length=10, choices=TURNO_CHOICES)
    fecha_ingreso = models.DateField()
    
    def __str__(self):
        return f"{self.usuario.persona.nombre} - {self.puesto}"