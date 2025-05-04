import db from '../config/db';
import { RowDataPacket } from 'mysql2';

// Definir interfaces para los resultados
interface TipoTurno extends RowDataPacket {
  id: number;
  nombre: string;
  // Otros campos que pueda tener la tabla
}

interface SubtipoTurno extends RowDataPacket {
  id: number;
  nombre: string;
  tipo_turno_id: number;
  // Otros campos que pueda tener la tabla
}

export class TipoTurnoModel {
  static async listarTipos(): Promise<TipoTurno[]> {
    const [rows] = await db.query<TipoTurno[]>('SELECT * FROM tipos_turno');
    return rows;
  }

  static async obtenerSubtipos(tipoId: number): Promise<SubtipoTurno[]> {
    const [rows] = await db.query<SubtipoTurno[]>(
      'SELECT * FROM subtipos_turno WHERE tipo_turno_id = ?',
      [tipoId]
    );
    return rows;
  }
}