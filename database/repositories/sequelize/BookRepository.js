/**
 * Repositorio Book con Sequelize
 * Maneja las operaciones de base de datos para libros usando Sequelize ORM
 */
const { Book } = require('../../../models/sequelize');

class BookRepository {
    constructor() {
        this.model = Book;
    }

    // Obtener todos los libros
    async findAll() {
        try {
            const books = await this.model.findAll({
                order: [['created_at', 'DESC']]
            });
            return books;
        } catch (error) {
            throw new Error(`Error obteniendo libros: ${error.message}`);
        }
    }

    // Obtener libro por ID
    async findById(id) {
        try {
            const book = await this.model.findByPk(id);
            return book;
        } catch (error) {
            throw new Error(`Error obteniendo libro: ${error.message}`);
        }
    }

    // Crear nuevo libro
    async create(bookData) {
        try {
            const book = await this.model.create({
                title: bookData.title,
                author: bookData.author || null,
                publishedAt: bookData.publishedAt || null
            });
            return book;
        } catch (error) {
            throw new Error(`Error creando libro: ${error.message}`);
        }
    }

    // Actualizar libro
    async update(id, bookData) {
        try {
            const book = await this.model.findByPk(id);
            if (!book) {
                throw new Error('Libro no encontrado');
            }

            await book.update({
                title: bookData.title !== undefined ? bookData.title : book.title,
                author: bookData.author !== undefined ? bookData.author : book.author,
                publishedAt: bookData.publishedAt !== undefined ? bookData.publishedAt : book.publishedAt
            });

            return book;
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                throw error;
            }
            throw new Error(`Error actualizando libro: ${error.message}`);
        }
    }

    // Eliminar libro
    async delete(id) {
        try {
            const book = await this.model.findByPk(id);
            if (!book) {
                throw new Error('Libro no encontrado');
            }

            await book.destroy();
            return true;
        } catch (error) {
            if (error.message === 'Libro no encontrado') {
                throw error;
            }
            throw new Error(`Error eliminando libro: ${error.message}`);
        }
    }

    // Verificar si existe un libro
    async exists(id) {
        try {
            const book = await this.model.findByPk(id);
            return book !== null;
        } catch (error) {
            return false;
        }
    }

    // Buscar libros por título
    async findByTitle(title) {
        try {
            const books = await this.model.findAll({
                where: {
                    title: {
                        [require('sequelize').Op.like]: `%${title}%`
                    }
                },
                order: [['created_at', 'DESC']]
            });
            return books;
        } catch (error) {
            throw new Error(`Error buscando libros por título: ${error.message}`);
        }
    }

    // Buscar libros por autor
    async findByAuthor(author) {
        try {
            const books = await this.model.findAll({
                where: {
                    author: {
                        [require('sequelize').Op.like]: `%${author}%`
                    }
                },
                order: [['created_at', 'DESC']]
            });
            return books;
        } catch (error) {
            throw new Error(`Error buscando libros por autor: ${error.message}`);
        }
    }

    // Contar total de libros
    async count() {
        try {
            const count = await this.model.count();
            return count;
        } catch (error) {
            throw new Error(`Error contando libros: ${error.message}`);
        }
    }
}

module.exports = BookRepository;
