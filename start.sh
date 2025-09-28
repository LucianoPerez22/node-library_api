#!/bin/bash

# Script de inicio rápido para la API de Biblioteca Node.js
echo "🚀 Iniciando API de Biblioteca - Node.js + Express..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    echo "   Visita: https://nodejs.org/"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

echo "✅ Node.js y npm están instalados"
echo "📦 Versión de Node.js: $(node --version)"
echo "📦 Versión de npm: $(npm --version)"

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando dependencias"
        exit 1
    fi
    echo "✅ Dependencias instaladas correctamente"
else
    echo "✅ Dependencias ya instaladas"
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cat > .env << EOF
# Configuración de la API de Biblioteca
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
EOF
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar que el puerto 3000 esté disponible
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3000 está en uso. Intentando detener procesos..."
    pkill -f "node.*server.js" 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🎯 Iniciando servidor..."
echo "📡 Puerto: 3000"
echo "🌐 URL: http://localhost:3000"
echo "📚 API de Biblioteca - Node.js + Express"
echo "====================================="
echo ""

# Iniciar servidor en modo desarrollo
npm run dev
