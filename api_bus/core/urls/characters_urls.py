from django.urls import path
from core.views.characters_views import RickAndMortyProxy

urlpatterns = [
    path('chars/', RickAndMortyProxy.as_view()),
]
