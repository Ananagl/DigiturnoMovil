import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
  static listarTipos(): Promise<TipoTurno[]> {
    return new Promise((resolve, reject) => {
      db.query<TipoTurno[]>('SELECT * FROM tipos_turno', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static obtenerSubtipos(tipoId: number): Promise<SubtipoTurno[]> {
    return new Promise((resolve, reject) => {
      db.query<SubtipoTurno[]>(
        'SELECT * FROM subtipos_turno WHERE tipo_turno_id = ?',
        [tipoId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }
}