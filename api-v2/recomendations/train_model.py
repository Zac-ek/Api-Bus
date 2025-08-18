import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors
import joblib
from utils.data_fetcher import obtener_datos_viajes

def entrenar_modelo():
    print("Obteniendo datos de viajes...")
    df = obtener_datos_viajes()
    
    # Ingeniería de características
    df['duracion_horas'] = (pd.to_datetime(df['llegada']) - 
                           pd.to_datetime(df['salida'])).dt.total_seconds() / 3600
    df['precio_por_hora'] = df['precio'] / df['duracion_horas']
    df['popularidad'] = np.log(df['asientosDisponibles'] + 1)
    
    # Preprocesador
    preprocessor = ColumnTransformer(
        transformers=[
            ('origen', OneHotEncoder(handle_unknown='ignore'), ['origen']),
            ('num', StandardScaler(), ['precio', 'precio_por_hora', 'popularidad'])
        ])
    
    print("Preprocesando datos...")
    X = preprocessor.fit_transform(df[['origen', 'precio', 'precio_por_hora', 'popularidad']])
    
    # Modelo KNN
    print("Entrenando modelo...")
    model = NearestNeighbors(
        n_neighbors=5,
        algorithm='ball_tree',
        metric='euclidean'
    )
    model.fit(X)
    
    # Guardar modelos
    print("Guardando modelos...")
    joblib.dump(preprocessor, 'models/preprocessor.joblib')
    joblib.dump(model, 'models/recomendador.joblib')
    
    # Guardar encoder de destinos (NUEVO)
    destinos_unicos = df['destino'].unique()
    destino_encoder = {destino: idx for idx, destino in enumerate(destinos_unicos)}
    joblib.dump(destino_encoder, 'models/destino_encoder.joblib')
    
    # Guardar datos históricos
    df.to_csv('data/viajes_historico.csv', index=False)
    
    print("¡Modelos generados exitosamente!")

if __name__ == '__main__':
    entrenar_modelo()