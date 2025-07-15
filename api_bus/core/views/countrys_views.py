from rest_framework.views import APIView
from rest_framework.response import Response
from zeep import Client

class CountryListSOAPProxy(APIView):
    def get(self, request):
        wsdl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'
        client = Client(wsdl=wsdl)

        try:
            result = client.service.ListOfCountryNamesByName()
            # opcional: convertir a lista de dicts
            countries = [{'Code': c.sISOCode, 'Name': c.sName} for c in result]
            return Response(countries)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
