# 🔧 Guía de Solución de Problemas - Digiturno Backend

## Problemas Comunes y Soluciones

### 1. La API no responde o no muestra turnos

#### Verificar que el servidor esté corriendo:
```bash
cd digiturno-backend
npm start
```

#### Verificar la conexión a la base de datos:
- Asegúrate de que MySQL esté corriendo
- Verifica las variables de entorno en `.env`
- El servidor debe mostrar "✅ Conectado a MySQL" al iniciar

#### Probar la API:
```bash
# Health check
curl http://localhost:3000/health

# Obtener turnos
curl http://localhost:3000/turnos/asignados

# Obtener tipos de turno
curl http://localhost:3000/turnos/tipos-turno
```

### 2. No hay datos en la base de datos

#### Insertar datos de prueba:
```bash
# Instalar axios si no está instalado
npm install axios

# Insertar datos de prueba
node insert-test-data.js

# Verificar los datos
node test-api.js
```

### 3. Problemas de CORS

#### Verificar configuración:
- El frontend debe estar en una de las URLs permitidas:
  - `http://192.168.1.12:8100`
  - `http://localhost:8100`
  - `http://localhost:4200`
  - `http://localhost:3000`

#### Si el problema persiste:
- Agrega tu IP al array de `origin` en `src/app.ts`
- Reinicia el servidor

### 4. Logs y Debugging

#### Ver logs del servidor:
El servidor ahora muestra logs detallados de cada request:
```
2024-01-01T10:00:00.000Z - GET /turnos/asignados
```

#### Verificar errores en la consola del navegador:
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña Console
- Busca errores relacionados con la API

### 5. Estructura de la Base de Datos

#### Tablas requeridas:
- `turnos` - Almacena los turnos
- `tipos_turno` - Tipos de turno disponibles
- `jornadas` - Jornadas de trabajo
- `subtipos_turno` - Subtipos de turno

#### Verificar datos:
```sql
-- Ver turnos
SELECT * FROM turnos ORDER BY fecha_creacion DESC LIMIT 10;

-- Ver tipos de turno
SELECT * FROM tipos_turno;

-- Ver jornadas activas
SELECT * FROM jornadas WHERE estado = 'ACTIVA';
```

### 6. Comandos Útiles

#### Reiniciar el servidor:
```bash
# Detener con Ctrl+C y volver a iniciar
npm start

# O usar nodemon para auto-reload
npm run dev
```

#### Limpiar y reinstalar dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Verificar puertos en uso:
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### 7. Variables de Entorno

#### Archivo `.env` requerido:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=digiturno
DB_PORT=3306
PORT=3000
HOST=0.0.0.0
```

### 8. Contacto

Si los problemas persisten:
1. Revisa los logs del servidor
2. Verifica la consola del navegador
3. Ejecuta los scripts de prueba
4. Documenta el error específico 