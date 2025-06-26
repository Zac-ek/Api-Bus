from core.models import Ruta, Horario
from .seed_autobuses import get_autobuses_creados
from faker import Faker
import random

fake = Faker()

rutas_creadas = []
horarios_creados = []

def seed_rutas_horarios(cantidad_rutas=200, horarios_por_ruta=3):
    print(f"Generando {cantidad_rutas} rutas y horarios asociados...")
    autobuses = get_autobuses_creados()
    dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    for _ in range(cantidad_rutas):
        ruta = Ruta.objects.create(
            nombre=fake.city() + " - " + fake.city(),
            punto_inicio=fake.city(),
            punto_final=fake.city(),
            distancia_km=round(random.uniform(5, 100), 2),
            tiempo_estimado=random.randint(15, 120),
            autobus_asignado=random.choice(autobuses),
            activo=True
        )
        rutas_creadas.append(ruta)

        for _ in range(horarios_por_ruta):
            horario = Horario.objects.create(
                hora_salida=fake.time_object(),
                hora_llegada=fake.time_object(),
                dias_disponibles=random.choice(dias),
                capacidad_disponible=random.randint(30, 60)
            )
            horarios_creados.append(horario)

    print("✓ Rutas y horarios generados correctamente")

def get_rutas_creadas():
    return rutas_creadas

def get_horarios_creados():
    return horarios_creados
