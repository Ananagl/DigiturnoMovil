import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Validar variables de entorno
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable de entorno ${envVar} es requerida`);
  }
}

// Configuración del pool de conexiones
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Conectado a MySQL desde database.ts');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL desde database.ts:', error);
    throw error;
  }
};

// Probar la conexión al iniciar
testConnection();