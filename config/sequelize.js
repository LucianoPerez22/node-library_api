/**
 * Configuración de Sequelize
 * Compatible con la configuración de Symfony
 */
require('dotenv').config({ path: './config.env' });

const config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'luchop84',
        database: process.env.DB_NAME || 'library',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timezone: '+00:00',
        logging: console.log, // Mostrar consultas SQL en desarrollo
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true, // Usar created_at y updated_at
            underscored: true, // Usar snake_case para nombres de columnas
            freezeTableName: true, // No pluralizar nombres de tablas
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timezone: '+00:00',
        logging: false, // No mostrar consultas en producción
        pool: {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
};

module.exports = config;
