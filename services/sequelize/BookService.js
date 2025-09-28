/**
 * Servicio de libros con Sequelize - Lógica de negocio
 * Se encarga únicamente de la lógica de negocio, no de HTTP
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

    // Buscar libros por título
    async searchBooksByTitle(title) {
        try {
            if (!title || title.trim().length === 0) {
                throw new Error('El término de búsqueda es requerido');
            }
            return await this.bookRepository.findByTitle(title);
        } catch (error) {
            throw new Error(`Error buscando libros: ${error.message}`);
        }
    }

    // Buscar libros por autor
    async searchBooksByAuthor(author) {
        try {
            if (!author || author.trim().length === 0) {
                throw new Error('El autor es requerido para la búsqueda');
            }
            return await this.bookRepository.findByAuthor(author);
        } catch (error) {
            throw new Error(`Error buscando libros por autor: ${error.message}`);
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
