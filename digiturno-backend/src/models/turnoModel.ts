import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { validarCampos, ValidationError } from '../utils/validations';

// Definir interfaces para los datos y resultados
interface TurnoData {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  tipo_turno_id: number;  
  subtipo_turno_id?: number;
}

interface PersonaEncontrada extends RowDataPacket {
  nombres: string;
  apellidos: string;
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

interface TurnoListado extends RowDataPacket {
  nombres: string;
  apellidos: string;
  tipo_turno: string;
  fecha_creacion: Date;
}


export class TurnoModel {
  static async crear(turnoData: TurnoData): Promise<{ id: number; message: string }> {
    // Validar campos antes de insertar
    try {
      validarCampos.nombres(turnoData.nombres);
      validarCampos.apellidos(turnoData.apellidos);
      validarCampos.documento(turnoData.numero_documento);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Error en la validación de datos');
    }

    return new Promise((resolve, reject) => {
      db.query<ResultSetHeader>(
        `INSERT INTO turnos 
         (nombres, apellidos, tipo_documento, numero_documento, tipo_turno_id, subtipo_turno_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          turnoData.nombres,
          turnoData.apellidos,
          turnoData.tipo_documento,
          turnoData.numero_documento,
          turnoData.tipo_turno_id,
          turnoData.subtipo_turno_id || null
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({ 
              id: result.insertId, 
              message: 'Turno registrado correctamente' 
            });
          }
        }
      );
    });
  }

  static buscarPorDocumento(
    tipo_documento: string,
    numero_documento: string
  ): Promise<PersonaEncontrada | null> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT nombres, apellidos
        FROM turnos
        WHERE tipo_documento = ? AND numero_documento = ?
        ORDER BY fecha_creacion DESC
        LIMIT 1
      `;
      db.query<PersonaEncontrada[]>(
        sql,
        [tipo_documento, numero_documento],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.length ? results[0] : null);
         }
       );
    });
  }
  
  static verificarExistente(numeroDocumento: string): Promise<{ existe: boolean }> {
    return new Promise((resolve, reject) => {
      db.query<TurnoExistente[]>(
        'SELECT COUNT(*) AS total FROM turnos WHERE numero_documento = ?',
        [numeroDocumento],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ existe: results[0].total > 0 });
          }
        }
      );
    });
  }

  static listarTurnosAsignados(fecha?: string): Promise<Turno[]> {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
          t.id,
          t.nombres,
          t.apellidos,
          t.tipo_documento,
          t.numero_documento,
          tt.nombre AS tipo_turno,
          st.nombre AS subtipo_turno,
          t.fecha_creacion,
          t.estado
        FROM turnos t
        JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
        LEFT JOIN subtipos_turno st ON t.subtipo_turno_id = st.id
      `;
      const params: any[] = [];
      if (fecha) {
        sql += ` WHERE DATE(t.fecha_creacion) = ?`;
        params.push(fecha);
      }
      sql += ` ORDER BY t.fecha_creacion ASC`;  // ascendente: primer registro del día primero
      db.query<Turno[]>(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
  
  static obtenerEstadisticas(): Promise<EstadisticaTurno[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          tt.nombre AS tipo_turno,
          COUNT(t.id) AS cantidad
        FROM turnos t
        JOIN tipos_turno tt ON t.tipo_turno_id = tt.id
        GROUP BY tt.nombre
      `;

      db.query<EstadisticaTurno[]>(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  static listarTurnosPorFecha(fechaDesde: Date): Promise<TurnoListado[]> {
    return new Promise((resolve, reject) => {
      const sql = `
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
      db.query<TurnoListado[]>(sql, [fechaDesde], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}
