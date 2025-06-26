from django.urls import path, include

urlpatterns = [
    path('personas/', include('core.urls.persona_urls')),
    path('usuarios/', include('core.urls.usuario_urls')),
    path('trabajadores/', include('core.urls.trabajador_urls')),
    path('autobuses/', include('core.urls.autobus_urls')),
    path('rutas/', include('core.urls.ruta_urls')),
    path('horarios/', include('core.urls.horario_urls')),
    path('boletos/', include('core.urls.boleto_urls')),
]