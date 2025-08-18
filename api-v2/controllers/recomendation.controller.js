import axios from 'axios';

export const recomendarDestinos = async (req, res) => {
    try {
        const { origen, precio, n } = req.query;
        
        const response = await axios.get('http://localhost:5000/recomendar', {
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