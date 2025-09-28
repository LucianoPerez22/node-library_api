# 📚 API de Biblioteca - Node.js + Express

Una API simple de biblioteca desarrollada con Node.js y Express, sin arquitectura hexagonal para facilitar el aprendizaje y comprensión.

## 🎯 Características

- **Simple y directo**: Sin arquitectura compleja, fácil de entender
- **Autenticación JWT**: Sistema de autenticación preparado (middleware disponible)
- **CRUD de libros**: Operaciones completas para gestión de libros
- **Base de datos con Sequelize**: ORM moderno y potente
- **Validación de datos**: Validación simple pero efectiva
- **Manejo de errores**: Respuestas consistentes y claras

## 🏗️ Estructura del Proyecto

```
node-library_api/
├── models/sequelize/        # Modelos de Sequelize
│   ├── Book.js             # Modelo de libro
│   ├── User.js             # Modelo de usuario
│   └── index.js            # Configuración de modelos
├── database/               # Configuración de base de datos
│   ├── sequelize.js        # Conexión Sequelize
│   └── repositories/sequelize/  # Repositorios de datos
│       ├── BookRepository.js
│       └── UserRepository.js
├── controllers/            # Controladores
│   ├── v1/                # Controladores v1
│   │   └── BookController.js
│   └── sequelize/         # Controladores Sequelize
│       └── BookController.js
├── services/              # Servicios de negocio
│   ├── v1/               # Servicios v1
│   │   └── BookService.js
│   └── sequelize/        # Servicios Sequelize
│       └── BookService.js
├── middleware/            # Middlewares
│   ├── auth.js           # Autenticación JWT
│   ├── validation.js     # Validación de datos
│   └── errorHandler.js   # Manejo de errores
├── routes/               # Rutas de la API
│   ├── v1/              # Rutas v1
│   │   └── books.js     # Rutas de libros v1
│   ├── sequelize/       # Rutas Sequelize
│   │   └── books.js
│   └── v2/              # Rutas v2 (futuro)
├── config/              # Configuración
│   └── sequelize.js     # Configuración Sequelize
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

### 📚 Libros (API v1)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/books` | Obtener todos los libros | No |
| GET | `/api/v1/books/stats` | Obtener estadísticas de libros | No |
| GET | `/api/v1/books/search` | Buscar libros (título y/o autor) | No |
| GET | `/api/v1/books/:id` | Obtener libro por ID | No |
| POST | `/api/v1/books` | Crear nuevo libro | Sí |
| PUT | `/api/v1/books/:id` | Actualizar libro | Sí |
| DELETE | `/api/v1/books/:id` | Eliminar libro | Sí |

## 📝 Ejemplos de Uso

### 1. Obtener todos los libros

```bash
curl http://localhost:3000/api/v1/books
```

### 2. Obtener estadísticas de libros

```bash
curl http://localhost:3000/api/v1/books/stats
```

### 3. Buscar libros

```bash
# Buscar por título
curl "http://localhost:3000/api/v1/books/search?title=quijote"

# Buscar por autor
curl "http://localhost:3000/api/v1/books/search?author=cervantes"

# Buscar por título y autor
curl "http://localhost:3000/api/v1/books/search?title=quijote&author=cervantes"
```

### 4. Obtener un libro por ID

```bash
curl http://localhost:3000/api/v1/books/1
```

### 5. Crear un libro (requiere token)

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "El Quijote",
    "author": "Miguel de Cervantes",
    "publishedAt": "1605-01-01"
  }'
```

### 6. Actualizar un libro (requiere token)

```bash
curl -X PUT http://localhost:3000/api/v1/books/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Don Quijote de la Mancha",
    "author": "Miguel de Cervantes Saavedra",
    "publishedAt": "1605-01-01"
  }'
```

### 7. Eliminar un libro (requiere token)

```bash
curl -X DELETE http://localhost:3000/api/v1/books/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🔧 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **Sequelize**: ORM para Node.js
- **MySQL2**: Driver de MySQL para Node.js
- **JWT**: Autenticación con tokens
- **bcryptjs**: Hash de contraseñas
- **Helmet**: Seguridad HTTP
- **CORS**: Cross-Origin Resource Sharing
- **express-rate-limit**: Limitación de requests
- **Joi**: Validación de esquemas
- **dotenv**: Gestión de variables de entorno

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT para autenticación
- Rate limiting para prevenir abuso
- Validación de datos de entrada
- Headers de seguridad con Helmet

## 📊 Base de Datos

La aplicación usa MySQL con Sequelize ORM y las siguientes tablas:

### Tabla `users`
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `email` (VARCHAR(255), UNIQUE)
- `password` (VARCHAR(255), hasheado)
- `first_name` (VARCHAR(255))
- `last_name` (VARCHAR(255))
- `last_login_at` (DATETIME)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Tabla `books`
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `title` (VARCHAR(255))
- `author` (VARCHAR(255))
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
- La base de datos MySQL con Sequelize es ideal para desarrollo y producción
- Los tokens JWT no tienen refresh, considera implementarlo para producción
- La autenticación está preparada pero no implementada en las rutas actuales

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
