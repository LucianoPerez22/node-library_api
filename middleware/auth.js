/**
 * Middleware de autenticación JWT
 */
const jwt = require('jsonwebtoken');
const UserRepository = require('../database/repositories/UserRepository');
const database = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_cambiar_en_produccion';

class AuthMiddleware {
    constructor() {
        this.userRepository = new UserRepository(database);
    }

    // Middleware para verificar JWT
    async verifyToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const token = authHeader.split(' ')[1]; // Bearer TOKEN
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Obtener el usuario desde la base de datos
            const user = await this.userRepository.findById(decoded.userId);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Agregar el usuario al request
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido'
                });
            }
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado'
                });
            }

            console.error('Error en middleware de autenticación:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Generar token JWT
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '24h' // Token válido por 24 horas
        });
    }

    // Middleware opcional (no requiere autenticación)
    async optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                req.user = null;
                return next();
            }

            const token = authHeader.split(' ')[1];
            
            if (!token) {
                req.user = null;
                return next();
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await this.userRepository.findById(decoded.userId);
            
            req.user = user || null;
            next();
        } catch (error) {
            // Si hay error, continuar sin usuario autenticado
            req.user = null;
            next();
        }
    }
}

module.exports = new AuthMiddleware();
