const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

const turnosPrueba = [
    {
        nombres: "Juan Carlos",
        apellidos: "González Pérez",
        tipo_documento: "CC",
        numero_documento: "12345678",
        tipo_turno_id: 1,
        subtipo_turno_id: 1
    },
    {
        nombres: "María Elena",
        apellidos: "Rodríguez López",
        tipo_documento: "CC",
        numero_documento: "87654321",
        tipo_turno_id: 2,
        subtipo_turno_id: 2
    },
    {
        nombres: "Carlos Alberto",
        apellidos: "Martínez Silva",
        tipo_documento: "CC",
        numero_documento: "11223344",
        tipo_turno_id: 3,
        subtipo_turno_id: 3
    },
    {
        nombres: "Ana Sofía",
        apellidos: "Hernández Vargas",
        tipo_documento: "CC",
        numero_documento: "55667788",
        tipo_turno_id: 1,
        subtipo_turno_id: 1
    },
    {
        nombres: "Luis Fernando",
        apellidos: "Díaz Morales",
        tipo_documento: "CC",
        numero_documento: "99887766",
        tipo_turno_id: 2,
        subtipo_turno_id: 2
    }
];

async function insertarDatosPrueba() {
    console.log('📝 Insertando datos de prueba...\n');

    for (let i = 0; i < turnosPrueba.length; i++) {
        const turno = turnosPrueba[i];
        try {
            console.log(`${i + 1}. Insertando turno para ${turno.nombres} ${turno.apellidos}...`);
            const response = await axios.post(`${API_BASE_URL}/turnos`, turno);
            console.log(`✅ Turno creado: ${response.data.message}`);
        } catch (error) {
            console.error(`❌ Error al crear turno ${i + 1}:`, error.response?.data?.error || error.message);
        }
        
        // Pequeña pausa entre inserciones
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Proceso completado!');
    console.log('📊 Verifica los datos ejecutando: node test-api.js');
}

// Ejecutar la inserción
insertarDatosPrueba(); 