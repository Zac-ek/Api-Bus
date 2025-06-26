from .persona_urls import urlpatterns as persona_urlpatterns
from .usuario_urls import urlpatterns as usuario_urlpatterns
from .trabajador_urls import urlpatterns as trabajador_urlpatterns
from .autobus_urls import urlpatterns as autobus_urlpatterns
from .ruta_urls import urlpatterns as ruta_urlpatterns
from .horario_urls import urlpatterns as horario_urlpatterns
from .boleto_urls import urlpatterns as boleto_urlpatterns

__all__ = [
    'persona_urlpatterns',
    'usuario_urlpatterns',
    'trabajador_urlpatterns',
    'autobus_urlpatterns',
    'ruta_urlpatterns',
    'horario_urlpatterns',
    'boleto_urlpatterns'
]