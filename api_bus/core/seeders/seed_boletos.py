from core.models import Boleto
from .seed_personas_usuarios import get_usuarios_creados
from .seed_rutas_horarios import get_rutas_creadas, get_horarios_creados
from faker import Faker
import random

fake = Faker()

def seed_boletos(cantidad=200):
    print(f"Generando {cantidad:,} boletos...")
    usuarios = get_usuarios_creados()
    rutas = get_rutas_creadas()
    horarios = get_horarios_creados()

    for _ in range(cantidad):
        usuario = random.choice(usuarios)
        ruta = random.choice(rutas)
        autobus = ruta.autobus_asignado
        horario = random.choice(horarios)
        fecha_viaje = fake.date_between(start_date='today', end_date='+90d')

        Boleto.objects.create(
            usuario=usuario,
            ruta=ruta,
            autobus=autobus,
            horario=horario,
            fecha_viaje=fecha_viaje,
            asiento_numero=random.randint(1, autobus.capacidad),
            estado=random.choice(['reservado', 'completado']),
            precio=round(random.uniform(10, 300), 2)
        )

    print("✓ Boletos generados correctamente")
