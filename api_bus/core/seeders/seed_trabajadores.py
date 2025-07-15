from core.models import Persona, Usuario, Trabajador
from django.utils import timezone
from django.utils.crypto import get_random_string
from faker import Faker
import random

fake = Faker()

def seed_trabajadores(cantidad=250):
    print(f"Generando {cantidad} trabajadores...")
    for _ in range(cantidad):
        fecha_nacimiento = fake.date_of_birth(minimum_age=25, maximum_age=60)
        persona = Persona.objects.create(
            nombre=fake.first_name(),
            primer_apellido=fake.last_name(),
            segundo_apellido=fake.last_name(),
            genero=random.choice(['M', 'F']),
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
        Trabajador.objects.create(
            usuario=usuario,
            puesto=random.choice(['conductor', 'supervisor', 'mantenimiento']),
            turno=random.choice(['mañana', 'tarde', 'noche']),
            fecha_ingreso=fake.date_between(start_date='-5y', end_date='today')
        )
    print("✓ Trabajadores generados correctamente")
