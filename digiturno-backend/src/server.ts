import app from './app';

// Forzar la salida de logs
process.stdout.write('=== SERVIDOR INICIANDO ===\n');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log('✅ Conectado a MySQL');
  process.stdout.write('=== SERVIDOR LISTO ===\n');
});
