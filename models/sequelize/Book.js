/**
 * Modelo Book con Sequelize
 * Compatible con la tabla 'book' de Symfony
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/sequelize');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El título es requerido'
            },
            len: {
                args: [1, 500],
                msg: 'El título debe tener entre 1 y 500 caracteres'
            }
        }
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'El autor no puede exceder 255 caracteres'
            }
        }
    },
    publishedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'published_at',
        validate: {
            isDate: {
                msg: 'La fecha de publicación debe ser válida'
            }
        }
    }
}, {
    tableName: 'book', // Usar la tabla 'book' (singular) de Symfony
    timestamps: true, // Usar created_at y updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Usar snake_case para nombres de columnas
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

// Métodos de instancia
Book.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return {
        id: values.id,
        title: values.title,
        author: values.author,
        publishedAt: values.published_at,
        createdAt: values.created_at,
        updatedAt: values.updated_at
    };
};

// Métodos estáticos
Book.validate = function(bookData) {
    const errors = [];
    
    if (!bookData.title || bookData.title.trim().length === 0) {
        errors.push('El título es requerido');
    }
    
    if (bookData.title && bookData.title.length > 500) {
        errors.push('El título no puede exceder 500 caracteres');
    }
    
    if (bookData.author && bookData.author.length > 255) {
        errors.push('El autor no puede exceder 255 caracteres');
    }
    
    if (bookData.publishedAt) {
        const date = new Date(bookData.publishedAt);
        if (isNaN(date.getTime())) {
            errors.push('La fecha de publicación debe ser válida');
        }
    }
    
    return errors;
};

module.exports = Book;
