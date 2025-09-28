/**
 * Índice de modelos Sequelize
 * Exporta todos los modelos y configura las asociaciones
 */
const { sequelize } = require('../../database/sequelize');

// Importar modelos
const Book = require('./Book');
const User = require('./User');

// Configurar asociaciones (si las hay)
// Por ejemplo:
// User.hasMany(Book, { foreignKey: 'userId' });
// Book.belongsTo(User, { foreignKey: 'userId' });

// Exportar modelos y sequelize
module.exports = {
    sequelize,
    Book,
    User
};
