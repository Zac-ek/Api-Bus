from django.urls import path
from core.views.countrys_views import CountryListSOAPProxy

urlpatterns = [
    path('country/', CountryListSOAPProxy.as_view()),
]
