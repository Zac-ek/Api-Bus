from core.models import Persona, Usuario
from django.utils import timezone
from django.utils.crypto import get_random_string
from faker import Faker
import random

fake = Faker()

personas_creadas = []
usuarios_creados = []

def seed_personas_usuarios(cantidad=100_000):
    print(f"Generando {cantidad} personas y usuarios mayores de edad...")
    for _ in range(cantidad):
        fecha_nacimiento = fake.date_of_birth(minimum_age=18, maximum_age=70)
        persona = Persona.objects.create(
            nombre=fake.first_name(),
            primer_apellido=fake.last_name(),
            segundo_apellido=fake.last_name(),
            genero=random.choice(['M', 'F', 'O']),
            documento_identidad=get_random_string(10),
            fecha_nacimiento=fecha_nacimiento,
            tipo="usuario"
        )
        usuario = Usuario.objects.create(
            persona=persona,
            correo_electronico=fake.unique.email(),
            telefono=fake.phone_number(),
            contrasena_hash=get_random_string(32),
            estado="activo",
            ultima_conexion=timezone.now()
        )
        personas_creadas.append(persona)
        usuarios_creados.append(usuario)
    print("✓ Personas y usuarios generados correctamente")

def get_usuarios_creados():
    return usuarios_creados
