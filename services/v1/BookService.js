/**
 * Servicio de libros v1 con Sequelize - Lógica de negocio
 * Se encarga únicamente de la lógica de negocio, no de HTTP - Versión 1
 */
const BookRepository = require('../../database/repositories/sequelize/BookRepository');

class BookService {
    constructor() {
        this.bookRepository = new BookRepository();
    }

    // Obtener todos los libros
    async getAllBooks() {
        try {
            return await this.bookRepository.findAll();
        } catch (error) {
            throw new Error(`Error obteniendo libros: ${error.message}`);
        }
    }

    // Obtener libro por ID
    async getBookById(id) {
        try {
            const book = await this.bookRepository.findById(id);
            if (!book) {
                throw new Error('Libro no encontrado');
            }
            return book;
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                throw error; // Re-lanzar error específico
            }
            throw new Error(`Error obteniendo libro: ${error.message}`);
        }
    }

    // Crear nuevo libro
    async createBook(bookData) {
        try {
            // Validar que el título no esté vacío (lógica de negocio)
            if (!bookData.title || bookData.title.trim().length === 0) {
                throw new Error('El título del libro es requerido');
            }

            // Crear el libro usando el repositorio
            const book = await this.bookRepository.create(bookData);
            return book;
        } catch (error) {
            throw new Error(`Error creando libro: ${error.message}`);
        }
    }

    // Actualizar libro
    async updateBook(id, bookData) {
        try {
            // Verificar que el libro existe
            const existingBook = await this.bookRepository.findById(id);
            if (!existingBook) {
                throw new Error('Libro no encontrado');
            }

            // Validar que si se proporciona título, no esté vacío
            if (bookData.title !== undefined && bookData.title.trim().length === 0) {
                throw new Error('El título del libro no puede estar vacío');
            }

            const updatedBook = await this.bookRepository.update(id, bookData);
            return updatedBook;
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                throw error; // Re-lanzar error específico
            }
            throw new Error(`Error actualizando libro: ${error.message}`);
        }
    }

    // Eliminar libro
    async deleteBook(id) {
        try {
            // Verificar que el libro existe
            const existingBook = await this.bookRepository.findById(id);
            if (!existingBook) {
                throw new Error('Libro no encontrado');
            }

            await this.bookRepository.delete(id);
            return true;
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                throw error; // Re-lanzar error específico
            }
            throw new Error(`Error eliminando libro: ${error.message}`);
        }
    }

    // Verificar si un libro existe
    async bookExists(id) {
        try {
            return await this.bookRepository.exists(id);
        } catch (error) {
            throw new Error(`Error verificando existencia del libro: ${error.message}`);
        }
    }

    // Búsqueda unificada (título y/o autor)
    async searchBooks(query) {
        try {
            const { title, author } = query;
            
            // Si no se proporciona ningún criterio de búsqueda, devolver todos los libros
            if (!title && !author) {
                return await this.getAllBooks();
            }
            
            // Si se proporciona título, buscar por título
            if (title && title.trim().length > 0) {
                return await this.bookRepository.findByTitle(title);
            }
            
            // Si se proporciona autor, buscar por autor
            if (author && author.trim().length > 0) {
                return await this.bookRepository.findByAuthor(author);
            }
            
            return [];
        } catch (error) {
            throw new Error(`Error buscando libros: ${error.message}`);
        }
    }

    // Obtener estadísticas de libros
    async getBookStats() {
        try {
            const totalBooks = await this.bookRepository.count();
            return {
                totalBooks,
                message: `Total de libros en la biblioteca: ${totalBooks}`
            };
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }
}

module.exports = BookService;
