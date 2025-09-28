/**
 * Rutas de libros v1 con Sequelize
 * Define las rutas HTTP para la gestión de libros - Versión 1
 */
const express = require('express');
const BookController = require('../../controllers/v1/BookController');

const router = express.Router();
const bookController = new BookController();

// Rutas de libros v1
router.get('/', bookController.index.bind(bookController)); // GET /api/v1/books
router.get('/stats', bookController.getStats.bind(bookController)); // GET /api/v1/books/stats
router.get('/search', bookController.search.bind(bookController)); // GET /api/v1/books/search?title=...&author=...
router.get('/:id', bookController.show.bind(bookController)); // GET /api/v1/books/:id
router.post('/', bookController.create.bind(bookController)); // POST /api/v1/books
router.put('/:id', bookController.update.bind(bookController)); // PUT /api/v1/books/:id
router.delete('/:id', bookController.delete.bind(bookController)); // DELETE /api/v1/books/:id

module.exports = router;
