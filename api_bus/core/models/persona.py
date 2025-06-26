from django.db import models

class Persona(models.Model):
    GENERO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    TIPO_CHOICES = [
        ('usuario', 'Usuario'),
        ('acompanante', 'Acompañante'),
        ('externo', 'Externo'),
    ]
    
    nombre = models.CharField(max_length=100)
    primer_apellido = models.CharField(max_length=100)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES)
    documento_identidad = models.CharField(max_length=20, unique=True)
    fecha_nacimiento = models.DateField()
    tipo = models.CharField(max_length=11, choices=TIPO_CHOICES)
    
    def __str__(self):
        return f"{self.nombre} {self.primer_apellido}"