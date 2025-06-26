from django.urls import path
from core.views.usuario_views import UsuarioListCreate, UsuarioRetrieveUpdateDestroy

app_name = 'usuarios'

urlpatterns = [
    path('', UsuarioListCreate.as_view(), name='usuario-list'),
    path('<int:pk>/', UsuarioRetrieveUpdateDestroy.as_view(), name='usuario-detail'),
]
