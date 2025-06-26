from django.urls import path
from core.views.ruta_views import RutaListCreate, RutaRetrieveUpdateDestroy

app_name = 'rutas'

urlpatterns = [
    path('', RutaListCreate.as_view(), name='ruta-list'),
    path('<int:pk>/', RutaRetrieveUpdateDestroy.as_view(), name='ruta-detail'),
]