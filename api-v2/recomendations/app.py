from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv
from sklearn.cluster import DBSCAN
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

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

@app.get("/")
def root():
    return {"ok": True}

@app.get("/health")
def health():
    return {"ok": True}, 200

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

def _nivel_demanda(prob):
    # prob en [0,1]
    if prob >= 0.75:
        return "alta"
    if prob >= 0.50:
        return "media"
    return "baja"

def cargar_datos():
    DATABASE_URL = "mysql+pymysql://root:Zadex031011@localhost:3309/apibus"
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        query = text("""
            SELECT 
              r.id AS rutaId,
              r.punto_inicio AS origen,
              r.punto_final AS destino,
              b.fecha_viaje,
              COUNT(b.id) AS asientos_vendidos,
              a.capacidad AS capacidad_autobus
            FROM Boletos b
            JOIN Rutas r     ON b.ruta_id    = r.id
            JOIN Autobuses a ON b.autobus_id = a.id
            WHERE b.estado IN ('completado','reservado')
            GROUP BY r.id, b.fecha_viaje, a.capacidad
        """)
        result = session.execute(query)
        df = pd.DataFrame(result.fetchall(), columns=result.keys())

        if not df.empty:
            df['porcentaje_ocupacion'] = (df['asientos_vendidos'] / df['capacidad_autobus']) * 100
            df['nivel_demanda'] = df['porcentaje_ocupacion'].apply(
                lambda x: 'alta' if x > 75 else 'media' if x > 50 else 'baja'
            )
            df['fecha_viaje'] = pd.to_datetime(df['fecha_viaje'])
        return df

    except Exception as e:
        print(f"Error en cargar_datos: {e}")
        return pd.DataFrame()
    finally:
        session.close()
"""
@app.route('/predecir-rutas-populares', methods=['GET'])
def predecir_rutas_populares():
    fecha_consulta = request.args.get('fecha')  # YYYY-MM-DD
    n_rutas = int(request.args.get('n', 5))

    if not fecha_consulta:
        return jsonify({"success": False, "error": "Parámetro 'fecha' es requerido (YYYY-MM-DD)"}), 400

    df = cargar_datos()
    if df.empty:
        return jsonify({
            "success": True,
            "fecha_consulta": fecha_consulta,
            "rutas_recomendadas": []
        }), 200

    # Features temporales
    df['fecha'] = pd.to_datetime(df['fecha_viaje'])
    df['dia_mes'] = df['fecha'].dt.day
    df['dia_semana'] = df['fecha'].dt.dayofweek
    df['mes'] = df['fecha'].dt.month

    # Normalización (evitar división por cero)
    rng = df['asientos_vendidos'].max() - df['asientos_vendidos'].min()
    if rng == 0:
        df['ventas_normalizadas'] = 0.0
    else:
        df['ventas_normalizadas'] = (df['asientos_vendidos'] - df['asientos_vendidos'].min()) / rng

    # Clustering
    X = df[['dia_mes', 'dia_semana', 'mes', 'ventas_normalizadas']].values
    if len(X) < 3:
        # muy pocos datos para DBSCAN, devolvemos top por ventas promedio
        rutas_populares = (df.groupby('rutaId')
                             .agg({'asientos_vendidos': 'mean'})
                             .nlargest(n_rutas, 'asientos_vendidos')
                             .reset_index()
                             .to_dict('records'))
        return jsonify({
            "success": True,
            "fecha_consulta": fecha_consulta,
            "rutas_recomendadas": rutas_populares
        }), 200

    clustering = DBSCAN(eps=0.5, min_samples=3).fit(X)
    df['cluster'] = clustering.labels_

    # Buscar cluster “similar” a la fecha consultada
    fecha_obj = datetime.strptime(fecha_consulta, "%Y-%m-%d")
    dia_mes = fecha_obj.day
    mes = fecha_obj.month

    df_fecha = df[(df['dia_mes'] == dia_mes) & (df['mes'] == mes)]
    if df_fecha.empty:
        # fallback: top global
        rutas_populares = (df.groupby('rutaId')
                             .agg({'asientos_vendidos': 'mean'})
                             .nlargest(n_rutas, 'asientos_vendidos')
                             .reset_index()
                             .to_dict('records'))
    else:
        cluster_fecha = df_fecha.iloc[0]['cluster']
        candidatos = df[df['cluster'] == cluster_fecha]
        if candidatos.empty:
            candidatos = df  # fallback
        rutas_populares = (candidatos.groupby('rutaId')
                             .agg({'asientos_vendidos': 'mean'})
                             .nlargest(n_rutas, 'asientos_vendidos')
                             .reset_index()
                             .to_dict('records'))

    return jsonify({
        "success": True,
        "fecha_consulta": fecha_consulta,
        "rutas_recomendadas": rutas_populares
    }), 200
"""
@app.route('/predecir-rutas-populares', methods=['GET'])
def predecir_rutas_populares():   
    fecha_consulta = request.args.get('fecha')  # YYYY-MM-DD
    n_rutas = int(request.args.get('n', 5))

    if not fecha_consulta:
        return jsonify({"success": False, "error": "Parámetro 'fecha' (YYYY-MM-DD) es requerido"}), 400

    try:
        fecha_obj = datetime.strptime(fecha_consulta, "%Y-%m-%d")
    except ValueError:
        return jsonify({"success": False, "error": "Formato inválido de 'fecha'. Usa YYYY-MM-DD"}), 400

    # ------- Datos históricos -------
    df = cargar_datos()  # Debe devolver columnas: rutaId, origen, destino, fecha_viaje, asientos_vendidos, capacidad_autobus
    if df.empty:
        return jsonify({
            "success": True,
            "fecha_consulta": fecha_consulta,
            "rutas_populares": []
        }), 200

    # Normaliza tipos/fechas
    df['fecha_viaje'] = pd.to_datetime(df['fecha_viaje'], errors='coerce')
    df = df.dropna(subset=['fecha_viaje', 'asientos_vendidos', 'capacidad_autobus'])

    # Evita divisiones por cero / negativas
    df = df[df['capacidad_autobus'] > 0]

    # ------- “Fecha similar” (mismo día y mes) -------
    df['dia_mes'] = df['fecha_viaje'].dt.day
    df['mes'] = df['fecha_viaje'].dt.month

    candidatos = df[(df['dia_mes'] == fecha_obj.day) & (df['mes'] == fecha_obj.month)]
    if candidatos.empty:
        # Fallback: usar todos los datos
        candidatos = df.copy()

    # ------- Métrica de ocupación por ruta -------
    # probabilidad_ocupacion = promedio de (asientos_vendidos / capacidad_autobus)
    candidatos['prob'] = (candidatos['asientos_vendidos'] / candidatos['capacidad_autobus']).clip(0, 1)

    agg = (candidatos
           .groupby(['rutaId', 'origen', 'destino'], as_index=False)
           .agg(probabilidad_ocupacion=('prob', 'mean')))

    # Ordenar por probabilidad y tomar top N
    top = (agg
           .sort_values('probabilidad_ocupacion', ascending=False)
           .head(n_rutas)
           .copy())

    # Redondeo y nivel_demanda
    top['probabilidad_ocupacion'] = top['probabilidad_ocupacion'].round(2)
    top['nivel_demanda'] = top['probabilidad_ocupacion'].apply(_nivel_demanda)

    # ------- Salida con el formato solicitado -------
    rutas_out = [{
        "origen": row['origen'],
        "destino": row['destino'],
        "probabilidad_ocupacion": float(row['probabilidad_ocupacion']),
        "nivel_demanda": row['nivel_demanda']
    } for _, row in top.iterrows()]

    return jsonify({
        "success": True,
        "fecha_consulta": fecha_consulta,
        "rutas_populares": rutas_out
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'False') == 'True')