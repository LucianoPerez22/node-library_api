/**
 * Controlador de libros v1 con Sequelize - Solo manejo de HTTP
 * Se encarga únicamente de recibir requests y enviar responses - Versión 1
 */
const BookService = require('../../services/v1/BookService');
const ErrorHandler = require('../../middleware/errorHandler');

class BookController {
    constructor() {
        this.bookService = new BookService();
    }

    // Obtener todos los libros
    async index(req, res, next) {
        try {
            const books = await this.bookService.getAllBooks();
            
            res.json({
                success: true,
                message: 'Libros obtenidos exitosamente',
                data: books.map(book => book.toJSON())
            });
        } catch (error) {
            next(ErrorHandler.handleServiceError(error));
        }
    }

    // Obtener un libro por ID
    async show(req, res, next) {
        try {
            const { id } = req.params;
            const book = await this.bookService.getBookById(id);

            res.json({
                success: true,
                message: 'Libro obtenido exitosamente',
                data: book.toJSON()
            });
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    // Crear nuevo libro
    async create(req, res, next) {
        try {
            const bookData = req.body;
            const book = await this.bookService.createBook(bookData);

            res.status(201).json({
                success: true,
                message: 'Libro creado exitosamente',
                data: book.toJSON()
            });
        } catch (error) {
            next(ErrorHandler.handleServiceError(error));
        }
    }

    // Actualizar libro
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const bookData = req.body;
            const book = await this.bookService.updateBook(id, bookData);

            res.json({
                success: true,
                message: 'Libro actualizado exitosamente',
                data: book.toJSON()
            });
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    // Eliminar libro
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.bookService.deleteBook(id);

            res.json({
                success: true,
                message: 'Libro eliminado exitosamente'
            });
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    // Búsqueda unificada (título y/o autor)
    async search(req, res, next) {
        try {
            const { title, author } = req.query;
            const books = await this.bookService.searchBooks({ title, author });

            res.json({
                success: true,
                message: 'Búsqueda completada exitosamente',
                data: books.map(book => book.toJSON())
            });
        } catch (error) {
            next(ErrorHandler.handleServiceError(error));
        }
    }

    // Obtener estadísticas
    async getStats(req, res, next) {
        try {
            const stats = await this.bookService.getBookStats();

            res.json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            next(ErrorHandler.handleServiceError(error));
        }
    }
}

module.exports = BookController;
