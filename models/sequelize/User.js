/**
 * Modelo User con Sequelize
 * Compatible con la tabla 'user' de Symfony
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'El email debe tener un formato válido'
            },
            notEmpty: {
                msg: 'El email es requerido'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña es requerida'
            },
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'first_name',
        validate: {
            notEmpty: {
                msg: 'El nombre es requerido'
            }
        }
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'last_name',
        validate: {
            notEmpty: {
                msg: 'El apellido es requerido'
            }
        }
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at'
    }
}, {
    tableName: 'user', // Usar la tabla 'user' (singular) de Symfony
    timestamps: true, // Usar created_at y updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Usar snake_case para nombres de columnas
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

// Métodos de instancia
User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    // No incluir la contraseña en el JSON
    delete values.password;
    return {
        id: values.id,
        email: values.email,
        firstName: values.first_name,
        lastName: values.last_name,
        lastLoginAt: values.last_login_at,
        createdAt: values.created_at,
        updatedAt: values.updated_at
    };
};

// Métodos estáticos
User.validate = function(userData) {
    const errors = [];
    
    if (!userData.email || userData.email.trim().length === 0) {
        errors.push('El email es requerido');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            errors.push('El email debe tener un formato válido');
        }
    }
    
    if (!userData.password || userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (!userData.firstName || userData.firstName.trim().length === 0) {
        errors.push('El nombre es requerido');
    }
    
    if (!userData.lastName || userData.lastName.trim().length === 0) {
        errors.push('El apellido es requerido');
    }
    
    return errors;
};

module.exports = User;
