from django.db import models
from django.contrib.auth.hashers import make_password
from .persona import Persona

class Usuario(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]
    
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE, related_name='usuario')
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15)
    contrasena_hash = models.CharField(max_length=128)
    estado = models.CharField(max_length=8, choices=ESTADO_CHOICES, default='activo')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_conexion = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Solo para nuevos usuarios
            self.contrasena_hash = make_password(self.contrasena_hash)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.correo_electronico