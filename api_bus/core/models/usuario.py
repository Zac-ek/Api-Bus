from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from .persona import Persona

class UsuarioManager(BaseUserManager):
    def create_user(self, correo_electronico, password=None, **extra):
        if not correo_electronico:
            raise ValueError('El email es obligatorio')
        correo = self.normalize_email(correo_electronico)
        user = self.model(correo_electronico=correo, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo_electronico, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(correo_electronico, password, **extra)

class Usuario(AbstractBaseUser, PermissionsMixin):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    ]

    persona = models.OneToOneField(Persona, on_delete=models.CASCADE, related_name='usuario')
    usuario = models.CharField(max_length=50)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=25)
    contrasena_hash = models.CharField(max_length=128)
    estado = models.CharField(max_length=8, choices=ESTADO_CHOICES, default='activo')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_conexion = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'correo_electronico'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def __str__(self):
        return self.correo_electronico
