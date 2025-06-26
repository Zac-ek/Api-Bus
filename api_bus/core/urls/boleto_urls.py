from django.urls import path
from core.views.boleto_views import BoletoListCreate, BoletoRetrieveUpdateDestroy

app_name = 'boletos'

urlpatterns = [
    path('', BoletoListCreate.as_view(), name='boleto-list'),
    path('<int:pk>/', BoletoRetrieveUpdateDestroy.as_view(), name='boleto-detail'),
]
