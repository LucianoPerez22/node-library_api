/**
 * Repositorio User con Sequelize
 * Maneja las operaciones de base de datos para usuarios usando Sequelize ORM
 */
const { User } = require('../../../models/sequelize');

class UserRepository {
    constructor() {
        this.model = User;
    }

    // Obtener todos los usuarios
    async findAll() {
        try {
            const users = await this.model.findAll({
                order: [['created_at', 'DESC']]
            });
            return users;
        } catch (error) {
            throw new Error(`Error obteniendo usuarios: ${error.message}`);
        }
    }

    // Obtener usuario por ID
    async findById(id) {
        try {
            const user = await this.model.findByPk(id);
            return user;
        } catch (error) {
            throw new Error(`Error obteniendo usuario: ${error.message}`);
        }
    }

    // Obtener usuario por email
    async findByEmail(email) {
        try {
            const user = await this.model.findOne({
                where: { email: email }
            });
            return user;
        } catch (error) {
            throw new Error(`Error obteniendo usuario por email: ${error.message}`);
        }
    }

    // Crear nuevo usuario
    async create(userData) {
        try {
            const user = await this.model.create({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            });
            return user;
        } catch (error) {
            throw new Error(`Error creando usuario: ${error.message}`);
        }
    }

    // Actualizar usuario
    async update(id, userData) {
        try {
            const user = await this.model.findByPk(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            await user.update({
                email: userData.email !== undefined ? userData.email : user.email,
                password: userData.password !== undefined ? userData.password : user.password,
                firstName: userData.firstName !== undefined ? userData.firstName : user.firstName,
                lastName: userData.lastName !== undefined ? userData.lastName : user.lastName,
                lastLoginAt: userData.lastLoginAt !== undefined ? userData.lastLoginAt : user.lastLoginAt
            });

            return user;
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                throw error;
            }
            throw new Error(`Error actualizando usuario: ${error.message}`);
        }
    }

    // Eliminar usuario
    async delete(id) {
        try {
            const user = await this.model.findByPk(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            await user.destroy();
            return true;
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                throw error;
            }
            throw new Error(`Error eliminando usuario: ${error.message}`);
        }
    }

    // Verificar si existe un usuario
    async exists(id) {
        try {
            const user = await this.model.findByPk(id);
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    // Verificar si existe un usuario por email
    async existsByEmail(email) {
        try {
            const user = await this.model.findOne({
                where: { email: email }
            });
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    // Actualizar último login
    async updateLastLogin(id) {
        try {
            const user = await this.model.findByPk(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            await user.update({
                lastLoginAt: new Date()
            });

            return user;
        } catch (error) {
            if (error.message === 'Usuario no encontrado') {
                throw error;
            }
            throw new Error(`Error actualizando último login: ${error.message}`);
        }
    }

    // Contar total de usuarios
    async count() {
        try {
            const count = await this.model.count();
            return count;
        } catch (error) {
            throw new Error(`Error contando usuarios: ${error.message}`);
        }
    }
}

module.exports = UserRepository;
