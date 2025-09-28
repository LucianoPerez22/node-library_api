/**
 * Middleware para manejo de errores
 */
class ErrorHandler {
    // Middleware principal de manejo de errores
    static handleError(err, req, res, next) {
        console.error('Error capturado:', err);

        // Error de validación
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: err.details || [err.message]
            });
        }

        // Error de base de datos
        if (err.code && err.code.startsWith('SQLITE_')) {
            return res.status(500).json({
                success: false,
                message: 'Error de base de datos',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
            });
        }

        // Error de JWT
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        // Error 404
        if (err.status === 404) {
            return res.status(404).json({
                success: false,
                message: err.message || 'Recurso no encontrado'
            });
        }

        // Error 409 (conflicto)
        if (err.status === 409) {
            return res.status(409).json({
                success: false,
                message: err.message || 'Conflicto de recursos'
            });
        }

        // Error genérico del servidor
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Middleware para rutas no encontradas
    static notFound(req, res, next) {
        const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
        error.status = 404;
        next(error);
    }

    // Función helper para crear errores
    static createError(message, status = 500) {
        const error = new Error(message);
        error.status = status;
        return error;
    }

    // Función helper para manejar errores de base de datos
    static handleDatabaseError(error, operation) {
        console.error(`Error en ${operation}:`, error);
        
        if (error.message.includes('UNIQUE constraint failed')) {
            return this.createError('El recurso ya existe', 409);
        }
        
        if (error.message.includes('NOT NULL constraint failed')) {
            return this.createError('Faltan campos requeridos', 400);
        }
        
        return this.createError(`Error en ${operation}: ${error.message}`, 500);
    }

    // Función helper para manejar errores de servicios
    static handleServiceError(error) {
        console.error('Error en servicio:', error);
        
        // Si el error ya tiene un status, lo mantenemos
        if (error.status) {
            return error;
        }
        
        // Errores específicos conocidos
        if (error.message.includes('no encontrado')) {
            return this.createError(error.message, 404);
        }
        
        if (error.message.includes('ya existe')) {
            return this.createError(error.message, 409);
        }
        
        if (error.message.includes('Credenciales inválidas')) {
            return this.createError(error.message, 401);
        }
        
        // Error genérico del servidor
        return this.createError(error.message || 'Error interno del servidor', 500);
    }
}

module.exports = ErrorHandler;
