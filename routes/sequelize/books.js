/**
 * Rutas de libros con Sequelize
 * Define las rutas HTTP para la gestión de libros
 */
const express = require('express');
const BookController = require('../../controllers/sequelize/BookController');

const router = express.Router();
const bookController = new BookController();

// Rutas de libros
router.get('/', bookController.index.bind(bookController)); // GET /api/books
router.get('/stats', bookController.stats.bind(bookController)); // GET /api/books/stats
router.get('/search', bookController.searchByTitle.bind(bookController)); // GET /api/books/search?title=...
router.get('/search/author', bookController.searchByAuthor.bind(bookController)); // GET /api/books/search/author?author=...
router.get('/:id', bookController.show.bind(bookController)); // GET /api/books/:id
router.post('/', bookController.create.bind(bookController)); // POST /api/books
router.put('/:id', bookController.update.bind(bookController)); // PUT /api/books/:id
router.delete('/:id', bookController.delete.bind(bookController)); // DELETE /api/books/:id

module.exports = router;
