const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    console.log('🗄️  Configurando base de datos...\n');

    // Crear conexión sin especificar base de datos
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306
    });

    try {
        // Crear base de datos si no existe
        console.log('1. Creando base de datos...');
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Base de datos '${process.env.DB_NAME}' creada/verificada`);

        // Usar la base de datos
        await connection.execute(`USE ${process.env.DB_NAME}`);

        // Crear tabla tipos_turno
        console.log('\n2. Creando tabla tipos_turno...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tipos_turno (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla tipos_turno creada/verificada');

        // Crear tabla subtipos_turno
        console.log('\n3. Creando tabla subtipos_turno...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS subtipos_turno (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                tipo_turno_id INT NOT NULL,
                descripcion TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tipo_turno_id) REFERENCES tipos_turno(id)
            )
        `);
        console.log('✅ Tabla subtipos_turno creada/verificada');

        // Crear tabla jornadas
        console.log('\n4. Creando tabla jornadas...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS jornadas (
                id INT PRIMARY KEY AUTO_INCREMENT,
                fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_fin TIMESTAMP NULL,
                estado ENUM('ACTIVA', 'CERRADA') DEFAULT 'ACTIVA',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla jornadas creada/verificada');

        // Crear tabla turnos
        console.log('\n5. Creando tabla turnos...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS turnos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombres VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                tipo_documento VARCHAR(10) NOT NULL,
                numero_documento VARCHAR(20) NOT NULL,
                tipo_turno_id INT NOT NULL,
                subtipo_turno_id INT NULL,
                jornada_id INT NOT NULL,
                numero_turno INT NOT NULL,
                codigo_turno VARCHAR(20) NOT NULL,
                estado ENUM('PENDIENTE', 'LLAMADO', 'ATENDIDO', 'CANCELADO') DEFAULT 'PENDIENTE',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tipo_turno_id) REFERENCES tipos_turno(id),
                FOREIGN KEY (subtipo_turno_id) REFERENCES subtipos_turno(id),
                FOREIGN KEY (jornada_id) REFERENCES jornadas(id)
            )
        `);
        console.log('✅ Tabla turnos creada/verificada');

        // Insertar datos de prueba en tipos_turno
        console.log('\n6. Insertando tipos de turno de prueba...');
        const tiposTurno = [
            { nombre: 'General', descripcion: 'Turno general' },
            { nombre: 'Prioritario', descripcion: 'Turno prioritario' },
            { nombre: 'Otros', descripcion: 'Otros tipos de turno' }
        ];

        for (const tipo of tiposTurno) {
            await connection.execute(
                'INSERT IGNORE INTO tipos_turno (nombre, descripcion) VALUES (?, ?)',
                [tipo.nombre, tipo.descripcion]
            );
        }
        console.log('✅ Tipos de turno insertados');

        // Insertar subtipos de prueba
        console.log('\n7. Insertando subtipos de turno de prueba...');
        const subtiposTurno = [
            { nombre: 'Consulta General', tipo_turno_id: 1 },
            { nombre: 'Consulta Especializada', tipo_turno_id: 1 },
            { nombre: 'Adulto Mayor', tipo_turno_id: 2 },
            { nombre: 'Embarazada', tipo_turno_id: 2 },
            { nombre: 'Discapacidad', tipo_turno_id: 2 },
            { nombre: 'Otros Servicios', tipo_turno_id: 3 }
        ];

        for (const subtipo of subtiposTurno) {
            await connection.execute(
                'INSERT IGNORE INTO subtipos_turno (nombre, tipo_turno_id) VALUES (?, ?)',
                [subtipo.nombre, subtipo.tipo_turno_id]
            );
        }
        console.log('✅ Subtipos de turno insertados');

        // Crear jornada activa si no existe
        console.log('\n8. Verificando jornada activa...');
        const [jornadas] = await connection.execute('SELECT * FROM jornadas WHERE estado = "ACTIVA"');
        if (jornadas.length === 0) {
            await connection.execute('INSERT INTO jornadas (estado) VALUES ("ACTIVA")');
            console.log('✅ Jornada activa creada');
        } else {
            console.log('✅ Jornada activa ya existe');
        }

        console.log('\n🎉 Base de datos configurada exitosamente!');
        console.log('📊 Ahora puedes ejecutar: node insert-test-data.js');

    } catch (error) {
        console.error('❌ Error configurando la base de datos:', error);
    } finally {
        await connection.end();
    }
}

// Ejecutar la configuración
setupDatabase(); 