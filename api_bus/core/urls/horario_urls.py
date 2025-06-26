from django.urls import path
from core.views.horario_views import HorarioListCreate, HorarioRetrieveUpdateDestroy

app_name = 'horarios'

urlpatterns = [
    path('', HorarioListCreate.as_view(), name='horario-list'),
    path('<int:pk>/', HorarioRetrieveUpdateDestroy.as_view(), name='horario-detail'),
]