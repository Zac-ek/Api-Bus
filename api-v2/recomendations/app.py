from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Cargar modelos
preprocessor = joblib.load('models/preprocessor.joblib')
model = joblib.load('models/recomendador.joblib')
destino_encoder = joblib.load('models/destino_encoder.joblib')

# Cargar datos de referencia
df = pd.read_csv('data/viajes_historico.csv')

# Ejemplo de limpieza de datos
def clean_datetime(df):
    for col in ['salida', 'llegada']:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: 
                x if pd.isna(x) else 
                x.strip()[:-1] if x.endswith('Z') else 
                x.strip())
            # Asegurar formato HH:MM:SS con dos dígitos en segundos
            df[col] = df[col].apply(lambda x: 
                x if pd.isna(x) else
                x[:19] if len(x) > 19 else
                f"{x[:17]}0{x[17:]}" if len(x) == 18 and x[17:].isdigit() else
                x)
    return df

# Limpiar el DataFrame antes de usarlo
df = clean_datetime(df)

@app.route('/recomendar', methods=['GET'])
def recomendar():
    try:
        origen = request.args.get('origen')
        precio = float(request.args.get('precio'))
        n_recomendaciones = int(request.args.get('n', 3))
        
        # Preprocesar entrada
        input_data = pd.DataFrame([{
            'origen': origen,
            'precio': precio,
            'precio_por_hora': precio / 6,
            'popularidad': 3.0
        }])
        
        X_input = preprocessor.transform(input_data)
        
        # Obtener recomendaciones
        distances, indices = model.kneighbors(X_input, n_neighbors=n_recomendaciones)
        
        # Formatear respuesta
        recomendaciones = []
        for i, idx in enumerate(indices[0]):
            viaje = df.iloc[idx]
            
            # Corregir el manejo de fechas
            def parse_datetime(dt_str):
                if isinstance(dt_str, str):
                    # Asegurar formato correcto para ISO (YYYY-MM-DD HH:MM:SS)
                    parts = dt_str.split(' ')
                    if len(parts) == 2:
                        date_part, time_part = parts
                        # Asegurar que los segundos tengan 2 dígitos
                        time_parts = time_part.split(':')
                        if len(time_parts) == 3 and len(time_parts[2]) == 1:
                            time_parts[2] = time_parts[2].zfill(2)
                            time_part = ':'.join(time_parts)
                        return datetime.fromisoformat(f"{date_part}T{time_part}")
                return datetime.now()  # Valor por defecto si falla el parsing
            
            salida = parse_datetime(viaje['salida'])
            llegada = parse_datetime(viaje['llegada'])
            duracion = llegada - salida
            
            recomendaciones.append({
                'destino': viaje['destino'],
                'precio': float(viaje['precio']),
                'empresa': viaje['empresa'],
                'duracion': str(duracion),  # Corregido el typo
                'similitud': float(1 - distances[0][i])
            })
        
        return jsonify({
            "success": True,
            "origen": origen,
            "precio_referencia": precio,
            "recomendaciones": recomendaciones
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'False') == 'True')