/**
 * Middleware de validación simple
 */
const Book = require('../models/Book');
const User = require('../models/User');

class ValidationMiddleware {
    // Validar datos de libro
    validateBook(req, res, next) {
        try {
            const errors = Book.validate(req.body);
            
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de validación incorrectos',
                    errors: errors
                });
            }
            
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error en validación de datos',
                error: error.message
            });
        }
    }

    // Validar datos de usuario
    validateUser(req, res, next) {
        try {
            const errors = User.validate(req.body);
            
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de validación incorrectos',
                    errors: errors
                });
            }
            
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error en validación de datos',
                error: error.message
            });
        }
    }

    // Validar ID numérico
    validateId(req, res, next) {
        const id = parseInt(req.params.id);
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        
        req.params.id = id;
        next();
    }

    // Middleware para validar JSON
    validateJSON(req, res, next) {
        if (req.method === 'POST' || req.method === 'PUT') {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere un cuerpo JSON válido'
                });
            }
        }
        next();
    }
}

module.exports = new ValidationMiddleware();
