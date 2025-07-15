from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class RickAndMortyProxy(APIView):
    def get(self, request):
        # Llamada a la API externa
        external_url = 'https://rickandmortyapi.com/api/character'
        response = requests.get(external_url)
        
        if response.status_code == 200:
            data = response.json()
            return Response(data)
        else:
            return Response({'error': 'Error fetching data'}, status=500)
