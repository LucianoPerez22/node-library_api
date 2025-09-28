/**
 * Ejemplos de uso de la API de Biblioteca
 * Este archivo contiene ejemplos de cómo usar todos los endpoints
 */

const axios = require('axios');

// Configuración base
const BASE_URL = 'http://localhost:3000';
const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Variable para almacenar el token
let authToken = null;

/**
 * Ejemplos de autenticación
 */
async function authExamples() {
    console.log('🔐 === EJEMPLOS DE AUTENTICACIÓN ===\n');

    try {
        // 1. Registrar un nuevo usuario
        console.log('1. Registrando usuario...');
        const registerResponse = await API.post('/api/auth/register', {
            email: 'usuario@ejemplo.com',
            password: '123456',
            firstName: 'Juan',
            lastName: 'Pérez'
        });
        
        console.log('✅ Usuario registrado:', registerResponse.data);
        authToken = registerResponse.data.data.token;
        
    } catch (error) {
        if (error.response?.status === 409) {
            console.log('⚠️  Usuario ya existe, intentando login...');
            
            // 2. Login si el usuario ya existe
            const loginResponse = await API.post('/api/auth/login', {
                email: 'usuario@ejemplo.com',
                password: '123456'
            });
            
            console.log('✅ Login exitoso:', loginResponse.data);
            authToken = loginResponse.data.data.token;
        } else {
            console.error('❌ Error en registro:', error.response?.data || error.message);
        }
    }

    // 3. Obtener información del usuario
    console.log('\n3. Obteniendo información del usuario...');
    try {
        const meResponse = await API.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Información del usuario:', meResponse.data);
    } catch (error) {
        console.error('❌ Error obteniendo usuario:', error.response?.data || error.message);
    }
}

/**
 * Ejemplos de gestión de libros
 */
async function bookExamples() {
    console.log('\n📚 === EJEMPLOS DE GESTIÓN DE LIBROS ===\n');

    // 1. Obtener todos los libros (público)
    console.log('1. Obteniendo todos los libros...');
    try {
        const booksResponse = await API.get('/api/books');
        console.log('✅ Libros obtenidos:', booksResponse.data);
    } catch (error) {
        console.error('❌ Error obteniendo libros:', error.response?.data || error.message);
    }

    // 2. Crear un nuevo libro (requiere autenticación)
    console.log('\n2. Creando nuevo libro...');
    try {
        const createBookResponse = await API.post('/api/books', {
            title: 'El Quijote',
            author: 'Miguel de Cervantes',
            publishedAt: '1605-01-01'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Libro creado:', createBookResponse.data);
        const bookId = createBookResponse.data.data.id;

        // 3. Obtener libro específico
        console.log('\n3. Obteniendo libro específico...');
        const getBookResponse = await API.get(`/api/books/${bookId}`);
        console.log('✅ Libro obtenido:', getBookResponse.data);

        // 4. Actualizar libro
        console.log('\n4. Actualizando libro...');
        const updateBookResponse = await API.put(`/api/books/${bookId}`, {
            title: 'Don Quijote de la Mancha',
            author: 'Miguel de Cervantes Saavedra'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Libro actualizado:', updateBookResponse.data);

        // 5. Crear más libros para ejemplos
        console.log('\n5. Creando más libros...');
        const books = [
            {
                title: 'Cien años de soledad',
                author: 'Gabriel García Márquez',
                publishedAt: '1967-01-01'
            },
            {
                title: '1984',
                author: 'George Orwell',
                publishedAt: '1949-01-01'
            }
        ];

        for (const bookData of books) {
            try {
                const response = await API.post('/api/books', bookData, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                console.log(`✅ Libro "${bookData.title}" creado`);
            } catch (error) {
                console.error(`❌ Error creando libro "${bookData.title}":`, error.response?.data || error.message);
            }
        }

        // 6. Obtener todos los libros nuevamente
        console.log('\n6. Obteniendo todos los libros actualizados...');
        const allBooksResponse = await API.get('/api/books');
        console.log('✅ Todos los libros:', allBooksResponse.data);

        // 7. Eliminar libro (opcional - comentado para no eliminar datos)
        /*
        console.log('\n7. Eliminando libro...');
        const deleteResponse = await API.delete(`/api/books/${bookId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Libro eliminado:', deleteResponse.data);
        */

    } catch (error) {
        console.error('❌ Error en operaciones de libros:', error.response?.data || error.message);
    }
}

/**
 * Ejemplos de manejo de errores
 */
async function errorExamples() {
    console.log('\n⚠️  === EJEMPLOS DE MANEJO DE ERRORES ===\n');

    // 1. Intentar crear libro sin autenticación
    console.log('1. Intentando crear libro sin token...');
    try {
        await API.post('/api/books', {
            title: 'Libro sin token',
            author: 'Autor anónimo'
        });
    } catch (error) {
        console.log('✅ Error esperado (sin token):', error.response?.data);
    }

    // 2. Intentar obtener libro inexistente
    console.log('\n2. Intentando obtener libro inexistente...');
    try {
        await API.get('/api/books/99999');
    } catch (error) {
        console.log('✅ Error esperado (libro no encontrado):', error.response?.data);
    }

    // 3. Intentar crear libro con datos inválidos
    console.log('\n3. Intentando crear libro con datos inválidos...');
    try {
        await API.post('/api/books', {
            title: '', // Título vacío
            author: 'Autor'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
    } catch (error) {
        console.log('✅ Error esperado (validación):', error.response?.data);
    }
}

/**
 * Función principal para ejecutar todos los ejemplos
 */
async function runExamples() {
    console.log('🚀 === INICIANDO EJEMPLOS DE LA API DE BIBLIOTECA ===\n');
    
    try {
        // Verificar que el servidor esté funcionando
        const healthResponse = await API.get('/health');
        console.log('✅ Servidor funcionando:', healthResponse.data.message);
        console.log('');
        
        // Ejecutar ejemplos
        await authExamples();
        await bookExamples();
        await errorExamples();
        
        console.log('\n🎉 === TODOS LOS EJEMPLOS COMPLETADOS ===');
        console.log('📝 Revisa los logs arriba para ver cómo funciona cada endpoint');
        
    } catch (error) {
        console.error('❌ Error conectando al servidor:', error.message);
        console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
        console.log('   Ejecuta: npm run dev');
    }
}

// Ejecutar ejemplos si este archivo se ejecuta directamente
if (require.main === module) {
    runExamples();
}

module.exports = {
    runExamples,
    authExamples,
    bookExamples,
    errorExamples
};
