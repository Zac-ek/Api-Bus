from django.urls import path
from core.views.persona_views import PersonaListCreate, PersonaRetrieveUpdateDestroy

app_name = 'personas'

urlpatterns = [
    path('', PersonaListCreate.as_view(), name='persona-list'),
    path('<int:pk>/', PersonaRetrieveUpdateDestroy.as_view(), name='persona-detail'),
]