import db from '../config/db';
import { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { validarCampos, ValidationError } from '../utils/validations';
import { ContadorModel } from './contadorModel';
import {
  TurnoData,
  Turno,
  TurnoExistente,
  EstadisticaTurno,
  TurnoListado
} from '../types/turno';


export class TurnoModel {
  static async crear(turnoData: TurnoData): Promise<{ id: number; message: string }> {
    try {
      // Validar campos de entrada
      validarCampos.nombres(turnoData.nombres);
      validarCampos.apellidos(turnoData.apellidos);
      validarCampos.documento(turnoData.numero_documento);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new Error('Error en la validación de datos');
    }

    const conn: PoolConnection = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Generar código y número de turno
      const codigoTurno = await ContadorModel.generarCodigoTurno(turnoData.tipo_turno_id, conn);
      const numeroTurno = parseInt(codigoTurno.split('-')[1]);

      // Insertar en la base de datos
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
      return { id: result.insertId, message: 'Turno registrado correctamente' };

    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async verificarExistente(numeroDocumento: string): Promise<{ existe: boolean }> {
    const [results] = await db.query<TurnoExistente[]>(
      'SELECT COUNT(*) AS total FROM turnos WHERE numero_documento = ?',
      [numeroDocumento]
    );
    return { existe: results[0].total > 0 };
  }

  static async listarTurnosAsignados(): Promise<Turno[]> {
    const query = `
      SELECT 
        t.id,
        t.nombres,
        t.apellidos,
        t.tipo_documento,
        t.numero_documento,
        tt.nombre AS tipo_turno,
        st.nombre AS subtipo_turno,
        t.fecha_creacion,
        t.estado,
        t.numero_turno,
        t.codigo_turno
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      LEFT JOIN subtipos_turno st ON t.subtipo_turno_id = st.id
      ORDER BY t.fecha_creacion DESC
    `;
    const [results] = await db.query<Turno[]>(query);
    return results;
  }

  static async buscarPorDocumento(tipo: string, numero: string): Promise<Turno | null> {
    const query = `
      SELECT * FROM turnos
      WHERE tipo_documento = ? AND numero_documento = ?
      ORDER BY fecha_creacion DESC
      LIMIT 1
    `;
    const [rows] = await db.query<Turno[]>(query, [tipo, numero]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async listarTurnosPorFecha(fechaDesde: Date): Promise<TurnoListado[]> {
    const query = `
      SELECT 
        t.nombres,
        t.apellidos,
        tt.nombre AS tipo_turno,
        t.fecha_creacion
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      WHERE t.fecha_creacion >= ?
      ORDER BY t.fecha_creacion DESC
    `;
    const [results] = await db.query<TurnoListado[]>(query, [fechaDesde]);
    return results;
  }
}