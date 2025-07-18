# Guía de Despliegue Aislado - Sin Interferir Sistemas Existentes

## 🚨 Consideraciones Importantes

Este despliegue está diseñado para **NO INTERFERIR** con sistemas existentes en el servidor:
- Usa puerto **3001** (diferente al puerto 3000 que podría estar ocupado)
- Usa base de datos **separada** (`digiturno_movil`)
- Usa directorio **aislado** (`/opt/digiturno-movil`)
- Usa usuario **dedicado** (`digiturno`)

---

## 📋 Paso 1: Preparación del Servidor

### Crear usuario dedicado
```bash
# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash digiturno
sudo usermod -aG sudo digiturno

# Cambiar al usuario
sudo su - digiturno
```

### Crear directorio de trabajo
```bash
# Crear directorio de la aplicación
sudo mkdir -p /opt/digiturno-movil
sudo chown digiturno:digiturno /opt/digiturno-movil
cd /opt/digiturno-movil
```

---

## 📋 Paso 2: Instalación de Dependencias

### Verificar Node.js
```bash
# Verificar si Node.js está instalado
node --version
npm --version

# Si no está instalado, instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Instalar PM2 globalmente
```bash
sudo npm install -g pm2
```

---

## 📋 Paso 3: Desplegar el Código

### Opción A: Desde Git (Recomendado)
```bash
# Clonar el repositorio
git clone <tu-repositorio> .
# O si solo quieres el backend:
# git clone <tu-repositorio> temp && cp -r temp/digiturno-backend/* . && rm -rf temp

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

### Opción B: Subir archivos manualmente
```bash
# Subir archivos via SCP/SFTP a /opt/digiturno-movil/
# Luego ejecutar:
npm install
npm run build
```

---

## 📋 Paso 4: Configuración de Base de Datos

### Crear base de datos separada
```bash
# Conectar a MySQL como root
sudo mysql -u root -p

# Crear base de datos separada
CREATE DATABASE digiturno_movil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario dedicado (opcional, para mayor seguridad)
CREATE USER 'digiturno_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON digiturno_movil.* TO 'digiturno_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Configurar variables de entorno
```bash
# Crear archivo .env
nano .env
```

**Contenido del archivo .env:**
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=digiturno_user
DB_PASSWORD=tu_password_seguro
DB_NAME=digiturno_movil

# Configuración del Servidor
PORT=3001
HOST=0.0.0.0

# Configuración de Seguridad
NODE_ENV=production
```

### Configurar la base de datos
```bash
# Ejecutar script de configuración
node setup-database.js

# Insertar datos de prueba (opcional)
node insert-test-data.js
```

---

## 📋 Paso 5: Configuración de Firewall

### Abrir puerto específico
```bash
# Abrir solo el puerto 3001
sudo ufw allow 3001

# Verificar que el puerto esté abierto
sudo ufw status
```

### Verificar que no interfiera con otros servicios
```bash
# Verificar qué puertos están en uso
sudo netstat -tlnp | grep LISTEN

# Verificar que el puerto 3001 esté libre
sudo lsof -i :3001
```

---

## 📋 Paso 6: Configuración de PM2

### Crear archivo de configuración PM2
```bash
# Crear archivo ecosystem.config.js
nano ecosystem.config.js
```

**Contenido del archivo:**
```javascript
module.exports = {
  apps: [{
    name: 'digiturno-movil-backend',
    script: 'dist/app.js',
    cwd: '/opt/digiturno-movil',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/opt/digiturno-movil/logs/err.log',
    out_file: '/opt/digiturno-movil/logs/out.log',
    log_file: '/opt/digiturno-movil/logs/combined.log',
    time: true
  }]
};
```

### Crear directorio de logs
```bash
mkdir -p logs
```

### Iniciar con PM2
```bash
# Iniciar la aplicación
pm2 start ecosystem.config.js

# Configurar para que inicie automáticamente
pm2 startup
pm2 save

# Verificar estado
pm2 status
pm2 logs digiturno-movil-backend
```

---

## 📋 Paso 7: Configuración de Nginx (Opcional)

### Si quieres usar un subdominio o ruta específica
```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/digiturno-movil
```

**Configuración para subdominio:**
```nginx
server {
    listen 80;
    server_name digiturno-movil.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Configuración para ruta específica:**
```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Ruta específica para digiturno móvil
    location /digiturno-movil/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Otras rutas para sistemas existentes
    location / {
        # Configuración para sistemas existentes
    }
}
```

### Activar configuración
```bash
sudo ln -s /etc/nginx/sites-available/digiturno-movil /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📋 Paso 8: Verificación

### Probar endpoints
```bash
# Probar health check
curl http://31.97.136.77:3001/health

# Probar endpoint de tipos de turno
curl http://31.97.136.77:3001/turnos/tipos-turno

# Verificar logs
pm2 logs digiturno-movil-backend --lines 50
```

### Verificar que no interfiera
```bash
# Verificar que otros servicios sigan funcionando
# (depende de qué servicios tengas corriendo)

# Verificar uso de recursos
pm2 monit
```

---

## 📋 Comandos de Mantenimiento

### Gestión de la aplicación
```bash
# Reiniciar
pm2 restart digiturno-movil-backend

# Detener
pm2 stop digiturno-movil-backend

# Ver logs en tiempo real
pm2 logs digiturno-movil-backend --lines 100

# Ver estadísticas
pm2 show digiturno-movil-backend
```

### Actualizaciones
```bash
# Detener aplicación
pm2 stop digiturno-movil-backend

# Actualizar código
git pull origin main

# Reinstalar dependencias (si es necesario)
npm install

# Recompilar
npm run build

# Reiniciar
pm2 restart digiturno-movil-backend
```

---

## 🚨 Troubleshooting

### Si hay conflictos de puertos:
```bash
# Verificar qué está usando el puerto
sudo lsof -i :3001

# Cambiar puerto en .env y ecosystem.config.js si es necesario
```

### Si hay problemas de permisos:
```bash
# Verificar permisos del directorio
ls -la /opt/digiturno-movil

# Corregir permisos si es necesario
sudo chown -R digiturno:digiturno /opt/digiturno-movil
```

### Si la base de datos no conecta:
```bash
# Verificar conexión a MySQL
mysql -u digiturno_user -p digiturno_movil

# Verificar variables de entorno
cat .env
```

### Si PM2 no inicia automáticamente:
```bash
# Reconfigurar startup
pm2 unstartup
pm2 startup
pm2 save
```

---

## 📱 Actualizar Frontend

Después del despliegue, actualiza el frontend para usar el nuevo puerto:

**En `environment.ts` y `environment.prod.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://31.97.136.77:3001'  // Puerto 3001
};
``` 