#!/bin/bash

# Script de verificación para despliegue aislado
# Verifica que el backend esté funcionando sin interferir con otros servicios

echo "🔍 Verificando despliegue aislado de Digiturno Móvil..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar que el puerto 3001 esté en uso
echo "1. Verificando puerto 3001..."
if netstat -tlnp | grep :3001 > /dev/null; then
    print_status 0 "Puerto 3001 está activo"
else
    print_status 1 "Puerto 3001 no está activo"
fi

# 2. Verificar que el puerto 3000 NO esté siendo usado por nuestro servicio
echo "2. Verificando que no interfiera con puerto 3000..."
if netstat -tlnp | grep :3000 | grep digiturno > /dev/null; then
    print_status 1 "¡ADVERTENCIA! Nuestro servicio está usando puerto 3000"
else
    print_status 0 "Puerto 3000 no está siendo usado por nuestro servicio"
fi

# 3. Verificar PM2
echo "3. Verificando PM2..."
if pm2 list | grep digiturno-movil-backend > /dev/null; then
    print_status 0 "Aplicación digiturno-movil-backend está corriendo en PM2"
    pm2 show digiturno-movil-backend | grep "status\|memory\|cpu"
else
    print_status 1 "Aplicación digiturno-movil-backend NO está en PM2"
fi

# 4. Verificar base de datos
echo "4. Verificando base de datos..."
if mysql -u digiturno_user -p -e "USE digiturno_movil; SHOW TABLES;" 2>/dev/null; then
    print_status 0 "Base de datos digiturno_movil está accesible"
else
    print_status 1 "Base de datos digiturno_movil NO está accesible"
fi

# 5. Verificar endpoints
echo "5. Verificando endpoints..."
echo "   - Health check:"
if curl -s http://localhost:3001/health | grep -q "OK"; then
    print_status 0 "Health check responde correctamente"
else
    print_status 1 "Health check NO responde"
fi

echo "   - Tipos de turno:"
if curl -s http://localhost:3001/turnos/tipos-turno | grep -q "id"; then
    print_status 0 "Endpoint de tipos de turno responde"
else
    print_status 1 "Endpoint de tipos de turno NO responde"
fi

# 6. Verificar firewall
echo "6. Verificando firewall..."
if ufw status | grep "3001" > /dev/null; then
    print_status 0 "Puerto 3001 está abierto en firewall"
else
    print_warning "Puerto 3001 NO está abierto en firewall"
fi

# 7. Verificar directorio y permisos
echo "7. Verificando directorio y permisos..."
if [ -d "/opt/digiturno-movil" ]; then
    print_status 0 "Directorio /opt/digiturno-movil existe"
    if [ "$(stat -c '%U' /opt/digiturno-movil)" = "digiturno" ]; then
        print_status 0 "Permisos correctos en directorio"
    else
        print_warning "Permisos incorrectos en directorio"
    fi
else
    print_status 1 "Directorio /opt/digiturno-movil NO existe"
fi

# 8. Verificar logs
echo "8. Verificando logs..."
if [ -f "/opt/digiturno-movil/logs/combined.log" ]; then
    print_status 0 "Archivo de logs existe"
    echo "   Últimas 5 líneas de log:"
    tail -5 /opt/digiturno-movil/logs/combined.log
else
    print_warning "Archivo de logs NO existe"
fi

# 9. Verificar que no haya conflictos con otros servicios
echo "9. Verificando conflictos con otros servicios..."
echo "   Servicios corriendo en puertos similares:"
netstat -tlnp | grep -E ":(300[0-9]|80|443)" | grep -v "digiturno" || echo "   No se encontraron conflictos"

# 10. Verificar uso de recursos
echo "10. Verificando uso de recursos..."
if command -v pm2 > /dev/null; then
    echo "   Uso de memoria y CPU:"
    pm2 show digiturno-movil-backend | grep -E "memory|cpu|uptime"
fi

echo ""
echo "=================================================="
echo "🎯 Resumen de verificación completado"
echo ""
echo "Para ver logs en tiempo real:"
echo "  pm2 logs digiturno-movil-backend"
echo ""
echo "Para monitorear recursos:"
echo "  pm2 monit"
echo ""
echo "Para reiniciar el servicio:"
echo "  pm2 restart digiturno-movil-backend" 