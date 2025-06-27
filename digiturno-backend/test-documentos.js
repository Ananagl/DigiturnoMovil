const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testDocumentos() {
    console.log('🧪 Probando información de documentos...\n');

    try {
        // Test 1: Obtener turnos con documentos
        console.log('1. Obteniendo turnos con información de documentos...');
        const turnosResponse = await axios.get(`${API_BASE_URL}/turnos/asignados?dias=30`);
        
        console.log('✅ Turnos obtenidos:', turnosResponse.data.length);
        
        if (turnosResponse.data.length > 0) {
            console.log('\n📋 Primeros 3 turnos con documentos:');
            turnosResponse.data.slice(0, 3).forEach((turno, index) => {
                console.log(`   ${index + 1}. ${turno.nombres} ${turno.apellidos}`);
                console.log(`      Tipo: ${turno.tipo_turno}`);
                console.log(`      Documento: ${turno.tipo_documento} ${turno.numero_documento}`);
                console.log(`      Fecha: ${turno.fecha_creacion}`);
                console.log('');
            });
        } else {
            console.log('\n⚠️  No hay turnos en la base de datos');
            console.log('💡 Ejecuta: node insert-test-data.js para crear datos de prueba');
        }

        // Test 2: Verificar estructura de datos
        if (turnosResponse.data.length > 0) {
            const primerTurno = turnosResponse.data[0];
            console.log('2. Verificando estructura de datos...');
            
            const camposRequeridos = ['nombres', 'apellidos', 'tipo_turno', 'fecha_creacion', 'tipo_documento', 'numero_documento'];
            const camposFaltantes = camposRequeridos.filter(campo => !primerTurno.hasOwnProperty(campo));
            
            if (camposFaltantes.length === 0) {
                console.log('✅ Todos los campos requeridos están presentes');
            } else {
                console.log('❌ Campos faltantes:', camposFaltantes);
            }
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
testDocumentos(); 