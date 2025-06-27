const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Probando API...\n');

    try {
        // Test 1: Health check
        console.log('1. Probando health check...');
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check:', healthResponse.data);

        // Test 2: Obtener tipos de turno
        console.log('\n2. Probando obtener tipos de turno...');
        const tiposResponse = await axios.get(`${API_BASE_URL}/turnos/tipos-turno`);
        console.log('✅ Tipos de turno:', tiposResponse.data);

        // Test 3: Obtener turnos asignados
        console.log('\n3. Probando obtener turnos asignados...');
        const turnosResponse = await axios.get(`${API_BASE_URL}/turnos/asignados?dias=30`);
        console.log('✅ Turnos asignados:', turnosResponse.data);
        console.log(`📊 Total de turnos: ${turnosResponse.data.length}`);

        // Test 4: Verificar si hay turnos en la base de datos
        if (turnosResponse.data.length === 0) {
            console.log('\n⚠️  No hay turnos en la base de datos');
            console.log('💡 Para probar, puedes crear un turno usando el endpoint POST /turnos');
        } else {
            console.log('\n✅ Hay turnos en la base de datos');
            console.log('📋 Primeros 3 turnos:');
            turnosResponse.data.slice(0, 3).forEach((turno, index) => {
                console.log(`   ${index + 1}. ${turno.nombres} ${turno.apellidos} - ${turno.tipo_turno} (${turno.fecha_creacion})`);
            });
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        if (error.response) {
            console.error('📊 Status:', error.response.status);
            console.error('📋 Data:', error.response.data);
        }
    }
}

// Ejecutar la prueba
testAPI(); 