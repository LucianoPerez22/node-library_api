# 📚 API de Biblioteca - Node.js + Express

Una API simple de biblioteca desarrollada con Node.js y Express, sin arquitectura hexagonal para facilitar el aprendizaje y comprensión.

## 🎯 Características

- **Simple y directo**: Sin arquitectura compleja, fácil de entender
- **Autenticación JWT**: Sistema de login/registro seguro
- **CRUD de libros**: Operaciones completas para gestión de libros
- **Base de datos SQLite**: Fácil de configurar y usar
- **Validación de datos**: Validación simple pero efectiva
- **Manejo de errores**: Respuestas consistentes y claras

## 🏗️ Estructura del Proyecto

```
node/
├── models/                 # Modelos de datos
│   ├── Book.js            # Modelo de libro
│   └── User.js            # Modelo de usuario
├── database/              # Configuración de base de datos
│   ├── database.js        # Conexión SQLite
│   └── repositories/      # Repositorios de datos
│       ├── BookRepository.js
│       └── UserRepository.js
├── middleware/            # Middlewares
│   ├── auth.js           # Autenticación JWT
│   ├── validation.js     # Validación de datos
│   └── errorHandler.js   # Manejo de errores
├── routes/               # Rutas de la API
│   ├── auth.js          # Rutas de autenticación
│   └── books.js         # Rutas de libros
├── server.js            # Servidor principal
├── package.json         # Dependencias
└── README.md           # Este archivo
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
cd node
npm install
```

### 2. Configurar variables de entorno (opcional)

```bash
# Crear archivo .env
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
PORT=3000
NODE_ENV=development
```

### 3. Ejecutar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

### 4. Verificar que funciona

```bash
curl http://localhost:3000/health
```

## 📡 Endpoints Disponibles

### 🔐 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Información del usuario | Sí |

### 📚 Libros

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Obtener todos los libros | No |
| GET | `/api/books/:id` | Obtener libro por ID | No |
| POST | `/api/books` | Crear nuevo libro | Sí |
| PUT | `/api/books/:id` | Actualizar libro | Sí |
| DELETE | `/api/books/:id` | Eliminar libro | Sí |

## 📝 Ejemplos de Uso

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

### 3. Crear un libro (requiere token)

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "publishedAt": "1605-01-01"
  }'
```

### 4. Obtener todos los libros

```bash
curl http://localhost:3000/api/books
```

## 🔧 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **SQLite3**: Base de datos ligera
- **JWT**: Autenticación con tokens
- **bcryptjs**: Hash de contraseñas
- **Helmet**: Seguridad HTTP
- **CORS**: Cross-Origin Resource Sharing
- **express-rate-limit**: Limitación de requests

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT para autenticación
- Rate limiting para prevenir abuso
- Validación de datos de entrada
- Headers de seguridad con Helmet

## 📊 Base de Datos

La aplicación usa SQLite con las siguientes tablas:

### Tabla `users`
- `id` (INTEGER, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `password` (TEXT, hasheado)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `last_login_at` (DATETIME)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Tabla `books`
- `id` (INTEGER, PRIMARY KEY)
- `title` (TEXT)
- `author` (TEXT)
- `published_at` (DATE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test
```

## 📈 Comparación con la Versión Symfony

| Aspecto | Symfony (Hexagonal) | Node.js (Simple) |
|---------|-------------------|------------------|
| **Arquitectura** | Hexagonal + CQRS | MVC simple |
| **Complejidad** | Alta | Baja |
| **Capas** | 4 capas | 3 capas |
| **Patrones** | Múltiples | Básicos |
| **Aprendizaje** | Complejo | Fácil |
| **Mantenimiento** | Estructurado | Directo |

## 🎓 Para Estudiar

Esta versión simplificada te permite:

1. **Entender los conceptos básicos** sin arquitectura compleja
2. **Ver la diferencia** entre arquitectura simple vs hexagonal
3. **Aprender Node.js/Express** de forma práctica
4. **Comparar enfoques** de desarrollo

## 🚨 Notas Importantes

- Esta es una versión **educativa** y **simplificada**
- Para producción, considera agregar más validaciones y seguridad
- La base de datos SQLite es perfecta para desarrollo, pero considera PostgreSQL/MySQL para producción
- Los tokens JWT no tienen refresh, considera implementarlo para producción

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, revisa:

1. Los comentarios en el código
2. Los logs del servidor
3. La documentación de Express.js
4. Los ejemplos de uso en este README

---

**Autor**: Luciano D. Perez  
**Versión**: 1.0.0  
**Licencia**: MIT
