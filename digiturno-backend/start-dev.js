const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidor de desarrollo...');

// Compilar TypeScript primero
console.log('📦 Compilando TypeScript...');
const tsc = spawn('npx', ['tsc'], { 
    stdio: 'inherit',
    shell: true 
});

tsc.on('close', (code) => {
    if (code === 0) {
        console.log('✅ TypeScript compilado exitosamente');
        
        // Iniciar el servidor
        console.log('🌐 Iniciando servidor...');
        const server = spawn('node', ['dist/app.js'], { 
            stdio: 'inherit',
            shell: true 
        });

        server.on('close', (code) => {
            console.log(`❌ Servidor terminado con código ${code}`);
        });
    } else {
        console.log(`❌ Error compilando TypeScript con código ${code}`);
    }
}); 