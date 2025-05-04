import db from '../config/db';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { validarCampos, ValidationError } from '../utils/validations';
import { ContadorModel } from './contadorModel';

// Definir interfaces para los datos y resultados
interface TurnoData {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_turno_id: number;
  subtipo_turno_id?: number;
}

interface Turno extends RowDataPacket {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_turno_id: number;
  subtipo_turno_id: number | null;
  fecha_creacion: Date;
  estado: string;
  numero_turno: number;
  codigo_turno: string;
  tipo_turno?: string;
  subtipo_turno?: string;
}

interface TurnoExistente extends RowDataPacket {
  total: number;
}

interface EstadisticaTurno extends RowDataPacket {
  tipo_turno: string;
  cantidad: number;
}

export class TurnoModel {
  static async crear(turnoData: TurnoData): Promise<{ id: number; message: string }> {
    // Validar campos antes de insertar
    try {
      validarCampos.nombres(turnoData.nombres);
      validarCampos.apellidos(turnoData.apellidos);
      validarCampos.documento(turnoData.numero_documento);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new Error('Error en la validación de datos');
    }
  
    // Obtener una conexión del pool
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      // 1. Generar el código de turno y obtener el número
      const codigoTurno = await ContadorModel.generarCodigoTurno(turnoData.tipo_turno_id, conn);
      const numeroTurno = parseInt(codigoTurno.split('-')[1]);
  
      // 2. Insertar el turno con el número y código
      const [result] = await conn.query<ResultSetHeader>(
        `INSERT INTO turnos 
          (nombres, apellidos, tipo_documento, numero_documento, tipo_turno_id, subtipo_turno_id, numero_turno, codigo_turno) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          turnoData.nombres,
          turnoData.apellidos,
          turnoData.tipo_documento,
          turnoData.numero_documento,
          turnoData.tipo_turno_id,
          turnoData.subtipo_turno_id || null,
          numeroTurno,
          codigoTurno
        ]
      );
  
      await conn.commit();
      return { 
        id: result.insertId, 
        message: `Turno registrado correctamente. Código: ${codigoTurno}` 
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async verificarExistente(numeroDocumento: string): Promise<{ existe: boolean }> {
    const [rows] = await db.query<TurnoExistente[]>(
      'SELECT COUNT(*) AS total FROM turnos WHERE numero_documento = ?',
      [numeroDocumento]
    );
    return { existe: rows[0].total > 0 };
  }

  static async listarTurnosAsignados(): Promise<Turno[]> {
    const query = `
      SELECT 
        t.id,
        t.nombres,
        t.apellidos,
        t.tipo_documento,
        t.numero_documento,
        t.numero_turno,
        t.codigo_turno,
        tt.nombre AS tipo_turno,
        st.nombre AS subtipo_turno,
        t.fecha_creacion,
        t.estado
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      LEFT JOIN subtipos_turno st ON t.subtipo_turno_id = st.id
      ORDER BY t.fecha_creacion DESC
    `;

    const [rows] = await db.query<Turno[]>(query);
    return rows;
  }

  static async obtenerEstadisticas(): Promise<EstadisticaTurno[]> {
    const query = `
      SELECT 
        tt.nombre AS tipo_turno,
        COUNT(t.id) AS cantidad
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      GROUP BY tt.nombre
    `;

    const [rows] = await db.query<EstadisticaTurno[]>(query);
    return rows;
  }
}