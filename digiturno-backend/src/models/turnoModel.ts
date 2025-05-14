import db from '../config/db';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { validarCampos, ValidationError } from '../utils/validations';
import { JornadaModel } from './jornadaModel';
import {
  TurnoData,
  Turno as TurnoType,
  TurnoExistente,
  EstadisticaTurno,
  TurnoListado
} from '../types/turno';

interface TurnoDB extends RowDataPacket {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_turno_id: number;
  subtipo_turno_id: number | null;
  jornada_id: number;
  fecha_creacion: Date;
  estado: 'PENDIENTE' | 'LLAMADO' | 'ATENDIDO' | 'CANCELADO';
  numero_turno: number;
  codigo_turno: string;
  tipo_turno?: string;
  subtipo_turno?: string | null;
}

interface EstadisticaTurnoDB extends RowDataPacket {
  tipo_turno: string;
  cantidad: number;
}

export class TurnoModel {
  private static async obtenerSiguienteNumeroTurno(tipoTurnoId: number, jornadaId: number): Promise<number> {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM turnos WHERE tipo_turno_id = ? AND jornada_id = ?',
      [tipoTurnoId, jornadaId]
    );
    return (rows[0].total as number) + 1;
  }

  private static generarCodigoTurno(tipoTurnoId: number, numeroTurno: number): string {
    let prefijo = 'G';
    switch (tipoTurnoId) {
      case 1: prefijo = 'G'; break;
      case 2: prefijo = 'P'; break;
      case 3: prefijo = 'O'; break;
      default: prefijo = 'G';
    }
    return `${prefijo}-${String(numeroTurno).padStart(3, '0')}`;
  }

  static async crear(turnoData: TurnoData): Promise<{ id: number; message: string }> {
    // Validar campos
    try {
      validarCampos.nombres(turnoData.nombres);
      validarCampos.apellidos(turnoData.apellidos);
      validarCampos.documento(turnoData.numero_documento);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new Error('Error en la validación de datos');
    }

    // Obtener jornada activa o crear una nueva
    let jornada = await JornadaModel.obtenerJornadaActiva();
    if (!jornada) {
      jornada = await JornadaModel.crearJornada();
    }

    // Obtener una conexión del pool
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Obtener el siguiente número de turno para este tipo en la jornada actual
      const numeroTurno = await this.obtenerSiguienteNumeroTurno(turnoData.tipo_turno_id, jornada.id);
      const codigoTurno = this.generarCodigoTurno(turnoData.tipo_turno_id, numeroTurno);

      // Insertar el turno
      const [result] = await conn.query<ResultSetHeader>(
        `INSERT INTO turnos 
          (nombres, apellidos, tipo_documento, numero_documento, 
           tipo_turno_id, subtipo_turno_id, jornada_id, 
           numero_turno, codigo_turno, estado) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
        [
          turnoData.nombres,
          turnoData.apellidos,
          turnoData.tipo_documento,
          turnoData.numero_documento,
          turnoData.tipo_turno_id,
          turnoData.subtipo_turno_id || null,
          jornada.id,
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
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total 
       FROM turnos t
       JOIN jornadas j ON t.jornada_id = j.id
       WHERE t.numero_documento = ? AND j.estado = 'ACTIVA'`,
      [numeroDocumento]
    );
    return { existe: (rows[0].total as number) > 0 };
  }

  static async listarTurnosAsignados(): Promise<TurnoDB[]> {
    const jornada = await JornadaModel.obtenerJornadaActiva();
    if (!jornada) {
      return [];
    }
    const turnos = await JornadaModel.obtenerTurnosPorJornada(jornada.id);
    return turnos as TurnoDB[];
  }

  static async actualizarEstado(turnoId: number, nuevoEstado: 'LLAMADO' | 'ATENDIDO' | 'CANCELADO'): Promise<void> {
    await db.query(
      'UPDATE turnos SET estado = ? WHERE id = ?',
      [nuevoEstado, turnoId]
    );
  }

  static async obtenerEstadisticas(): Promise<EstadisticaTurnoDB[]> {
    const jornada = await JornadaModel.obtenerJornadaActiva();
    if (!jornada) {
      return [];
    }

    const query = `
      SELECT 
        tt.nombre AS tipo_turno,
        COUNT(t.id) AS cantidad
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      WHERE t.jornada_id = ?
      GROUP BY tt.nombre
    `;

    const [rows] = await db.query<EstadisticaTurnoDB[]>(query, [jornada.id]);
    return rows;
  }

  static async buscarPorDocumento(tipo: string, numero: string): Promise<TurnoDB | null> {
    const query = `
      SELECT * FROM turnos
      WHERE tipo_documento = ? AND numero_documento = ?
      ORDER BY fecha_creacion DESC
      LIMIT 1
    `;
    const [rows] = await db.query<TurnoDB[]>(query, [tipo, numero]);
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