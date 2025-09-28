/**
 * Servidor principal de la API de biblioteca
 * Versión con Sequelize ORM para Node.js y Express
 */
require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar Sequelize y rutas
const { testConnection, syncModels, closeConnection } = require('./database/sequelize');
const bookRoutes = require('./routes/v1/books');
const ErrorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP cada 15 minutos
    message: {
        success: false,
        message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde'
    }
});

// Middleware global
app.use(helmet()); // Seguridad básica
app.use(limiter); // Rate limiting
app.use(cors()); // CORS habilitado
app.use(express.json({ limit: '10mb' })); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL encoded

// Middleware de logging simple
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente con Sequelize',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        apiVersion: 'v1',
        orm: 'Sequelize'
    });
});

// Rutas de la API v1
app.use('/api/v1/books', bookRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Biblioteca - Node.js + Express + Sequelize',
        version: '1.0.0',
        apiVersion: 'v1',
        orm: 'Sequelize',
        endpoints: {
            v1: {
                books: {
                    'GET /api/v1/books': 'Obtener todos los libros',
                    'GET /api/v1/books/stats': 'Obtener estadísticas de libros',
                    'GET /api/v1/books/search?title=...&author=...': 'Buscar libros (título y/o autor)',
                    'GET /api/v1/books/:id': 'Obtener libro por ID',
                    'POST /api/v1/books': 'Crear nuevo libro',
                    'PUT /api/v1/books/:id': 'Actualizar libro',
                    'DELETE /api/v1/books/:id': 'Eliminar libro'
                }
            }
        }
    });
});

// Middleware para rutas no encontradas
app.use(ErrorHandler.notFound);

// Middleware de manejo de errores
app.use(ErrorHandler.handleError);

// Función para iniciar el servidor
async function startServer() {
    try {
        // Conectar a la base de datos con Sequelize
        const connected = await testConnection();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        
        // Sincronizar modelos (solo en desarrollo)
        await syncModels();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('🚀 Servidor iniciado exitosamente con Sequelize');
            console.log(`📡 Puerto: ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📚 API de Biblioteca - Node.js + Express + Sequelize`);
            console.log(`🗄️  ORM: Sequelize`);
            console.log('=====================================');
        });
    } catch (error) {
        console.error('❌ Error iniciando el servidor:', error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    try {
        await closeConnection();
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cerrando servidor:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando servidor...');
    try {
        await closeConnection();
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cerrando servidor:', error);
        process.exit(1);
    }
});

// Iniciar servidor
startServer();

module.exports = app;
