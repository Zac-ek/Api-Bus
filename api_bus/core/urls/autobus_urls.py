from django.urls import path
from core.views.autobus_views import AutobusListCreate, AutobusRetrieveUpdateDestroy

app_name = 'autobuses'

urlpatterns = [
    path('', AutobusListCreate.as_view(), name='autobus-list'),
    path('<int:pk>/', AutobusRetrieveUpdateDestroy.as_view(), name='autobus-detail'),
]