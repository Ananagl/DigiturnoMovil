import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface Jornada extends RowDataPacket {
  id: number;
  fecha_inicio: Date;
  fecha_fin: Date | null;
  estado: 'ACTIVA' | 'FINALIZADA';
}

interface TurnoJornada extends RowDataPacket {
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
  tipo_turno: string;
  subtipo_turno: string | null;
}

export class JornadaModel {
  static async obtenerJornadaActiva(): Promise<Jornada | null> {
    const [rows] = await db.query<Jornada[]>(
      'SELECT * FROM jornadas WHERE estado = "ACTIVA" ORDER BY fecha_inicio DESC LIMIT 1'
    );
    return rows[0] || null;
  }

  static async crearJornada(): Promise<Jornada> {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO jornadas (fecha_inicio, estado) VALUES (NOW(), "ACTIVA")'
    );
    const [jornada] = await db.query<Jornada[]>(
      'SELECT * FROM jornadas WHERE id = ?',
      [result.insertId]
    );
    return jornada[0];
  }

  static async finalizarJornada(id: number): Promise<void> {
    await db.query(
      'UPDATE jornadas SET estado = "FINALIZADA", fecha_fin = NOW() WHERE id = ?',
      [id]
    );
  }

  static async obtenerTurnosPorJornada(jornadaId: number): Promise<TurnoJornada[]> {
    const query = `
      SELECT 
        t.*,
        tt.nombre as tipo_turno,
        st.nombre as subtipo_turno
      FROM turnos t
      JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
      LEFT JOIN subtipos_turno st ON t.subtipo_turno_id = st.id
      WHERE t.jornada_id = ?
      ORDER BY 
        CASE t.tipo_turno_id
          WHEN 2 THEN 1  -- PREFERENCIAL primero
          WHEN 1 THEN 2  -- GENERAL segundo
          WHEN 3 THEN 3  -- OTROS último
          ELSE 4
        END,
        t.numero_turno ASC
    `;
    const [rows] = await db.query<TurnoJornada[]>(query, [jornadaId]);
    return rows;
  }
} 