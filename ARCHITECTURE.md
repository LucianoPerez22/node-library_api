# 🏗️ Arquitectura del Proyecto - Node.js

## 📋 Principios de Diseño

### ✅ **Separación de Responsabilidades**
Cada capa tiene una responsabilidad específica y bien definida:

- **Routes**: Solo declaración de rutas y middleware
- **Controllers**: Solo manejo de HTTP (request/response)
- **Services**: Solo lógica de negocio
- **Repositories**: Solo acceso a datos
- **Models**: Solo estructura de datos

### ✅ **Principio de Responsabilidad Única**
Cada clase tiene una sola razón para cambiar.

## 🏛️ Estructura de Capas

```
┌─────────────────────────────────────────┐
│              ROUTES                     │  ← Solo declaración de rutas
│         (routes/*.js)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            CONTROLLERS                  │  ← Solo manejo HTTP
│        (controllers/*.js)               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│             SERVICES                    │  ← Solo lógica de negocio
│         (services/*.js)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           REPOSITORIES                  │  ← Solo acceso a datos
│    (database/repositories/*.js)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│             DATABASE                    │  ← Solo persistencia
│         (database/database.js)          │
└─────────────────────────────────────────┘
```

## 📁 Estructura de Archivos

```
node/
├── routes/                    # 🛣️  Declaración de rutas
│   ├── auth.js               # Rutas de autenticación
│   └── books.js              # Rutas de libros
├── controllers/               # 🎮  Manejo de HTTP
│   ├── AuthController.js     # Controlador de autenticación
│   └── BookController.js     # Controlador de libros
├── services/                  # 🧠  Lógica de negocio
│   ├── AuthService.js        # Servicio de autenticación
│   └── BookService.js        # Servicio de libros
├── database/                  # 💾  Acceso a datos
│   ├── database.js           # Configuración de BD
│   └── repositories/         # Repositorios
│       ├── UserRepository.js
│       └── BookRepository.js
├── models/                    # 📊  Estructura de datos
│   ├── User.js               # Modelo de usuario
│   └── Book.js               # Modelo de libro
├── middleware/                # 🔧  Middlewares
│   ├── auth.js               # Autenticación JWT
│   ├── validation.js         # Validación de datos
│   └── errorHandler.js       # Manejo de errores
└── server.js                 # 🚀  Servidor principal
```

## 🔄 Flujo de Datos

### 1. **Request HTTP**
```
Cliente → Routes → Middleware → Controller
```

### 2. **Procesamiento**
```
Controller → Service → Repository → Database
```

### 3. **Response HTTP**
```
Database → Repository → Service → Controller → Cliente
```

## 📝 Ejemplo de Flujo Completo

### Crear un Libro

1. **Route** (`routes/books.js`):
   ```javascript
   router.post('/', 
       authMiddleware.verifyToken,           // Middleware
       validationMiddleware.validateBook,    // Middleware
       bookController.create                 // Controller
   );
   ```

2. **Controller** (`controllers/BookController.js`):
   ```javascript
   async create(req, res, next) {
       try {
           const bookData = req.body;        // Extraer datos
           const book = await this.bookService.createBook(bookData); // Llamar servicio
           res.status(201).json({...});      // Enviar respuesta
       } catch (error) {
           next(ErrorHandler.handleServiceError(error)); // Manejar error
       }
   }
   ```

3. **Service** (`services/BookService.js`):
   ```javascript
   async createBook(bookData) {
       // Validar lógica de negocio
       if (!bookData.title || bookData.title.trim().length === 0) {
           throw new Error('El título del libro es requerido');
       }
       
       // Llamar repositorio
       return await this.bookRepository.create(bookData);
   }
   ```

4. **Repository** (`database/repositories/BookRepository.js`):
   ```javascript
   async create(bookData) {
       const sql = `INSERT INTO books (...) VALUES (...)`;
       const result = await this.db.run(sql, [...]);
       return await this.findById(result.id);
   }
   ```

## 🎯 Beneficios de esta Arquitectura

### ✅ **Testabilidad**
- Cada capa se puede testear independientemente
- Fácil mock de dependencias
- Tests unitarios y de integración claros

### ✅ **Mantenibilidad**
- Cambios en una capa no afectan otras
- Código más fácil de entender
- Responsabilidades claras

### ✅ **Escalabilidad**
- Fácil agregar nuevas funcionalidades
- Reutilización de código
- Separación clara de concerns

### ✅ **Flexibilidad**
- Fácil cambiar la base de datos
- Fácil cambiar la lógica de negocio
- Fácil cambiar la presentación

## 🔍 Comparación: Antes vs Después

### ❌ **Antes (Todo en Routes)**
```javascript
// routes/books.js - TODO MEZCLADO
router.post('/', async (req, res, next) => {
    try {
        // Validación
        const errors = Book.validate(req.body);
        if (errors.length > 0) return res.status(400).json({...});
        
        // Lógica de negocio
        if (!req.body.title) throw new Error('Título requerido');
        
        // Acceso a datos
        const book = await bookRepository.create(req.body);
        
        // Formateo de respuesta
        res.status(201).json({...});
    } catch (error) {
        // Manejo de errores
        next(ErrorHandler.handleDatabaseError(error, 'crear libro'));
    }
});
```

### ✅ **Después (Separado)**
```javascript
// routes/books.js - SOLO RUTAS
router.post('/', 
    authMiddleware.verifyToken,
    validationMiddleware.validateBook,
    bookController.create
);

// controllers/BookController.js - SOLO HTTP
async create(req, res, next) {
    try {
        const book = await this.bookService.createBook(req.body);
        res.status(201).json({...});
    } catch (error) {
        next(ErrorHandler.handleServiceError(error));
    }
}

// services/BookService.js - SOLO LÓGICA
async createBook(bookData) {
    if (!bookData.title) throw new Error('Título requerido');
    return await this.bookRepository.create(bookData);
}
```

## 🧪 Testing

### **Test de Controller**
```javascript
// Solo testear manejo de HTTP
test('should return 201 when book is created', async () => {
    const mockService = { createBook: jest.fn() };
    const controller = new BookController(mockService);
    // ... test
});
```

### **Test de Service**
```javascript
// Solo testear lógica de negocio
test('should throw error when title is empty', async () => {
    const service = new BookService();
    await expect(service.createBook({})).rejects.toThrow('Título requerido');
});
```

### **Test de Repository**
```javascript
// Solo testear acceso a datos
test('should create book in database', async () => {
    const repository = new BookRepository(mockDatabase);
    const book = await repository.create(bookData);
    expect(book.id).toBeDefined();
});
```

## 🚀 Próximos Pasos

1. **Agregar Tests**: Implementar tests unitarios para cada capa
2. **Validación Avanzada**: Usar Joi o similar para validación
3. **Logging**: Agregar logging estructurado
4. **Caching**: Implementar cache en la capa de servicio
5. **Documentación**: Generar documentación automática de la API

---

**Esta arquitectura mantiene la simplicidad pero con mejor organización y separación de responsabilidades.**
