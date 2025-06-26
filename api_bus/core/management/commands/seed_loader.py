# seed_loader.py
# Ejecuta todos los seeders de forma ordenada

from ...seeders.seed_personas_usuarios import seed_personas_usuarios
from ...seeders.seed_trabajadores import seed_trabajadores
from ...seeders.seed_autobuses import seed_autobuses
from ...seeders.seed_rutas_horarios import seed_rutas_horarios
from ...seeders.seed_boletos import seed_boletos

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Carga todos los seeders del sistema"

    def handle(self, *args, **options):
        seed_personas_usuarios()
        seed_trabajadores()
        seed_autobuses()
        seed_rutas_horarios()
        seed_boletos()
        self.stdout.write(self.style.SUCCESS("¡Todos los seeders se ejecutaron correctamente!"))
