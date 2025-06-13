@echo off
echo ============================================
echo 🚀 Iniciando DIGITURNO-MOVIL...
echo ============================================

:: 1. Iniciar backend (en nueva ventana)
echo 🔧 Iniciando backend...
start "Backend" cmd /c "cd digiturno-backend && npm run dev"

:: 2. Iniciar frontend (en nueva ventana)
echo 🌐 Iniciando frontend...
start "Frontend" cmd /c "cd digiturno-frontend && ionic serve --external"

:: 3. Sincronizar Capacitor (esperar frontend listo antes de esto si es necesario)
cd digiturno-frontend

echo 🔁 Sincronizando Capacitor...
npx cap sync android

:: 4. Ejecutar en dispositivo real
echo 📱 Ejecutando en dispositivo real...
npx cap run android

:: 5. Volver al directorio raíz
cd ..

echo ✅ Todos los procesos han sido iniciados.
pause
