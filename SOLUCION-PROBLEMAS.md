# 🔧 Solución de Problemas - Digiturno Móvil

## Problemas Identificados y Soluciones

### ✅ Problema 1: Estilos de lista-turnos no responsive

**Solución aplicada:**
- ✅ Actualizado el HTML para mostrar la lista de turnos
- ✅ Mejorados los estilos SCSS para ser responsive en móviles
- ✅ Agregado manejo de estados (carga, error, sin datos)
- ✅ Añadidas animaciones y efectos visuales

### ✅ Problema 2: API no muestra turnos

**Solución aplicada:**
- ✅ Corregida la configuración de CORS
- ✅ Agregado logging detallado en el backend
- ✅ Creados scripts de prueba y configuración
- ✅ Agregada ruta faltante para tipos de turno

## 📋 Pasos para Solucionar Completamente

### Paso 1: Configurar la Base de Datos

```bash
cd digiturno-backend

# 1. Verificar que tienes un archivo .env con las credenciales de MySQL
# Ejemplo de .env:
# DB_HOST=localhost
# DB_USER=tu_usuario
# DB_PASSWORD=tu_password
# DB_NAME=digiturno
# DB_PORT=3306

# 2. Configurar la base de datos
node setup-database.js
```

### Paso 2: Iniciar el Backend

```bash
cd digiturno-backend

# Instalar dependencias si no están instaladas
npm install

# Iniciar el servidor
npm start
```

**Verificar que aparece:**
```
🚀 Servidor corriendo en http://0.0.0.0:3000
📊 Health check: http://0.0.0.0:3000/health
✅ Conectado a MySQL
```

### Paso 3: Insertar Datos de Prueba

```bash
cd digiturno-backend

# Instalar axios si no está instalado
npm install axios

# Insertar datos de prueba
node insert-test-data.js

# Verificar que los datos se insertaron
node test-api.js
```

### Paso 4: Probar la API

```bash
# Health check
curl http://localhost:3000/health

# Obtener turnos
curl http://localhost:3000/turnos/asignados

# Obtener tipos de turno
curl http://localhost:3000/turnos/tipos-turno
```

### Paso 5: Iniciar el Frontend

```bash
cd digiturno-frontend

# Instalar dependencias si no están instaladas
npm install

# Iniciar el servidor de desarrollo
ionic serve
```

### Paso 6: Verificar en el Navegador

1. Abre `http://localhost:8100`
2. Ve a la página de "Lista de turnos"
3. Abre las herramientas de desarrollador (F12)
4. Ve a la pestaña Console
5. Verifica que no hay errores de CORS o conexión

## 🔍 Diagnóstico de Problemas

### Si no aparecen los turnos:

1. **Verificar la consola del navegador:**
   - Busca errores de red (Network tab)
   - Verifica errores de JavaScript (Console tab)

2. **Verificar los logs del backend:**
   - Debe mostrar logs de cada request
   - Busca errores de base de datos

3. **Verificar la base de datos:**
   ```sql
   SELECT * FROM turnos ORDER BY fecha_creacion DESC LIMIT 5;
   SELECT * FROM tipos_turno;
   SELECT * FROM jornadas WHERE estado = 'ACTIVA';
   ```

### Si hay errores de CORS:

1. **Verificar la IP del frontend:**
   - Asegúrate de que esté en la lista de origins permitidos
   - Agrega tu IP al array en `src/app.ts`

2. **Reiniciar el servidor:**
   ```bash
   # Detener con Ctrl+C
   npm start
   ```

### Si la base de datos no conecta:

1. **Verificar MySQL:**
   - Asegúrate de que MySQL esté corriendo
   - Verifica las credenciales en `.env`

2. **Probar conexión manual:**
   ```bash
   mysql -u tu_usuario -p -h localhost
   ```

## 📱 Verificación en Móvil

### Para probar en dispositivo móvil:

1. **Obtener la IP de tu computadora:**
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. **Actualizar environment.ts:**
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://TU_IP:3000'  // Reemplazar TU_IP
   };
   ```

3. **Agregar la IP al CORS del backend:**
   ```typescript
   origin: ['http://TU_IP:8100', 'http://localhost:8100', ...]
   ```

4. **Acceder desde el móvil:**
   - Conecta el móvil a la misma red WiFi
   - Abre `http://TU_IP:8100` en el navegador del móvil

## 🎯 Resultado Esperado

Después de seguir estos pasos:

- ✅ La lista de turnos se ve correctamente en móvil
- ✅ Los estilos son responsive y modernos
- ✅ La API responde correctamente
- ✅ Se muestran los turnos de la base de datos
- ✅ Hay manejo de errores y estados de carga

## 📞 Si los problemas persisten

1. Revisa los logs del servidor
2. Verifica la consola del navegador
3. Ejecuta los scripts de prueba
4. Documenta el error específico que aparece

Los archivos principales modificados:
- `digiturno-frontend/src/app/lista-turnos/lista-turnos.html`
- `digiturno-frontend/src/app/lista-turnos/lista-turnos.scss`
- `digiturno-frontend/src/app/lista-turnos/lista-turnos.ts`
- `digiturno-backend/src/app.ts`
- `digiturno-backend/src/controllers/turnos.controller.ts`
- `digiturno-backend/src/routes/turnos.routes.ts` 