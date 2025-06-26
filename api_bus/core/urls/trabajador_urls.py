from django.urls import path
from core.views.trabajador_views import TrabajadorListCreate, TrabajadorRetrieveUpdateDestroy

app_name = 'trabajoderes'

urlpatterns = [
    path('', TrabajadorListCreate.as_view(), name='trabajador-list'),
    path('<int:pk>/', TrabajadorRetrieveUpdateDestroy.as_view(), name='trabajador-detail'),
]