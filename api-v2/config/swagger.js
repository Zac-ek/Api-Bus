import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Byte-Buss',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de transporte',
      contact: {
        name: 'Los Pozoles'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './docs/auth.docs.js',
    './docs/autobuses.docs.js',
    './docs/boletos.docs.js',
    './docs/horarios.docs.js',    
    './docs/personas.docs.js',
    './docs/rutas.docs.js',
    './docs/trabajadores.docs.js',
    './docs/usuarios.docs.js',
    './docs/viajes.docs.js',
  ], // Ruta a tus archivos de rutas y controladores
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Ruta para la UI de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Disponible en JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Documentación Swagger disponible en http://localhost:${process.env.APP_PORT || 3000}/api-docs`);
};

export default swaggerDocs;