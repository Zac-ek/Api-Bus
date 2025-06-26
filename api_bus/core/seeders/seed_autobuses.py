from core.models import Autobus
from faker import Faker
import random

fake = Faker()

autobuses_creados = []

def seed_autobuses(cantidad=300):
    print(f"Generando {cantidad} autobuses...")
    for _ in range(cantidad):
        autobus = Autobus.objects.create(
            placa=fake.unique.license_plate(),
            modelo=random.choice(['Volvo', 'Mercedes-Benz', 'Scania', 'Irizar']),
            anio=random.randint(2015, 2023),
            capacidad=random.randint(40, 60),
            estado=random.choice(['activo', 'mantenimiento', 'fuera_de_servicio'])
        )
        autobuses_creados.append(autobus)
    print("✓ Autobuses generados correctamente")

def get_autobuses_creados():
    return autobuses_creados
