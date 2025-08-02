from core.models import Persona, Usuario
from django.utils import timezone
from django.utils.crypto import get_random_string
from faker import Faker
import random

fake = Faker('es_MX')

personas_creadas = []
usuarios_creados = []

# Listas realistas
nombres_comunes = [
    "Juan", "José", "Luis", "Carlos", "Jorge", "Miguel", "Francisco", "Pedro",
    "Ana", "María", "Luisa", "Carmen", "Laura", "Patricia", "Gabriela"
]

apellidos_comunes = [
    "Hernández", "García", "Martínez", "López", "González", "Pérez", "Rodríguez", "Sánchez",
    "Ramírez", "Cruz", "Flores", "Gómez", "Vargas", "Reyes", "Jiménez"
]

def seed_personas_usuarios(cantidad=100):
    print(f"Generando {cantidad} personas y usuarios mayores de edad...")

    for _ in range(cantidad):
        nombre = random.choice(nombres_comunes)
        primer_apellido = random.choice(apellidos_comunes)
        segundo_apellido = random.choice(apellidos_comunes)
        fecha_nacimiento = fake.date_of_birth(minimum_age=18, maximum_age=70)

        documento_identidad = fake.unique.bothify(text='????######???#')  # Simulación CURP

        persona = Persona.objects.create(
            nombre=nombre,
            primer_apellido=primer_apellido,
            segundo_apellido=segundo_apellido,
            genero=random.choice(['M', 'F', 'O']),
            fecha_nacimiento=fecha_nacimiento,
            tipo="usuario",
            documento_identidad=documento_identidad
        )

        usuario = Usuario.objects.create(
            persona=persona,
            usuario=f"{nombre.lower()}.{primer_apellido.lower()}{random.randint(100,999)}",
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
