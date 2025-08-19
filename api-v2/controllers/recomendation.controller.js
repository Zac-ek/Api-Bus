import axios from 'axios';


const RECO_API_BASE = process.env.RECO_API_BASE || 'http://api_flask:5000'; 

export const recomendarDestinos = async (req, res) => {
    try {
        const { origen, precio, n } = req.query;
        
        const response = await axios.get(`${RECO_API_BASE}/recomendar`, {
            params: { origen, precio, n: n || 3 }
        });
        
        const recomendaciones = response.data.recomendaciones.map(item => {
            const [hours, minutes] = item.duracion.split(':').slice(0, 2);
            return {
                ...item,
                duracion: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
            };
        });
        
        res.json({
            ...response.data,
            recomendaciones
        });
    } catch (error) {
        console.error('Error en recomendación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener recomendaciones',
            error: error.message
        });
    }
};

export const predecirRutasPopulares = async (req, res) => {
    try {
        const { fecha } = req.query;
        const response = await axios.get(`${RECO_API_BASE}/predecir-rutas-populares`, {
            params: { fecha }
        });
        
        res.json({
            success: true,
            ...response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en predicción de rutas',
            error: error.message
        });
    }
};