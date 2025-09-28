/**
 * Configuración principal de Sequelize
 * Conexión a la base de datos MySQL
 */
const { Sequelize } = require('sequelize');
const config = require('../config/sequelize');

// Determinar el entorno
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        charset: dbConfig.charset,
        collate: dbConfig.collate,
        timezone: dbConfig.timezone,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        define: dbConfig.define
    }
);

// Función para probar la conexión
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a Sequelize establecida correctamente');
        console.log(`📊 Base de datos: ${dbConfig.database}`);
        console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
        return true;
    } catch (error) {
        console.error('❌ Error conectando a Sequelize:', error.message);
        return false;
    }
}

// Función para sincronizar modelos (solo en desarrollo)
async function syncModels() {
    try {
        if (env === 'development') {
            // Solo verificar que las tablas existen, no alterarlas
            await sequelize.sync({ force: false, alter: false });
            console.log('✅ Modelos verificados con la base de datos');
        }
    } catch (error) {
        console.error('❌ Error sincronizando modelos:', error.message);
        // No lanzar error, solo mostrar advertencia
        console.log('⚠️  Continuando sin sincronización de modelos...');
    }
}

// Función para cerrar la conexión
async function closeConnection() {
    try {
        await sequelize.close();
        console.log('✅ Conexión Sequelize cerrada');
    } catch (error) {
        console.error('❌ Error cerrando conexión Sequelize:', error.message);
        throw error;
    }
}

module.exports = {
    sequelize,
    testConnection,
    syncModels,
    closeConnection
};
