import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

def obtener_datos_viajes():
    """Obtiene datos de viajes desde tu API Node.js"""
    try:
        response = requests.get(f"{os.getenv('NODE_API_URL')}/api/viajes")
        response.raise_for_status()
        
        datos = response.json()
        df = pd.DataFrame(datos)
        
        # Transformaciones básicas
        df['salida'] = pd.to_datetime(df['salida'])
        df['llegada'] = pd.to_datetime(df['llegada'])
        
        return df
        
    except Exception as e:
        print(f"Error obteniendo datos: {str(e)}")
        # Cargar datos históricos si la API falla
        return pd.read_csv('data/viajes_historico.csv')