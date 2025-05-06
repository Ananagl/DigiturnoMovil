import db from '../config/db';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';

interface ContadorTurno extends RowDataPacket {
  tipo_turno_id: number;
  ultimo_numero: number;
}

export class ContadorModel {
    static async obtenerContador(tipoTurnoId: number, conn: PoolConnection): Promise<number> {
        const [rows] = await conn.query<ContadorTurno[]>(
          'SELECT ultimo_numero FROM turno_counters WHERE tipo_turno_id = ? FOR UPDATE',
          [tipoTurnoId]
        );
        if (!rows.length) {
          throw new Error('No existe contador para este tipo de turno');
        }
        return rows[0].ultimo_numero;
    }
    
    static async incrementarContador(tipoTurnoId: number, conn: PoolConnection): Promise<number> {
        const numeroActual = await this.obtenerContador(tipoTurnoId, conn);
        const nuevoNumero = numeroActual + 1;
        await conn.query(
          'UPDATE turno_counters SET ultimo_numero = ? WHERE tipo_turno_id = ?',
          [nuevoNumero, tipoTurnoId]
        );
        return nuevoNumero;
    }
    
    static async generarCodigoTurno(tipoTurnoId: number, conn: PoolConnection): Promise<string> {
        const nuevoNumero = await this.incrementarContador(tipoTurnoId, conn);
        let prefijo = 'G';
        switch (tipoTurnoId) {
          case 1: prefijo = 'G'; break;
          case 2: prefijo = 'P'; break;
          case 3: prefijo = 'O'; break;
          default: prefijo = 'G';
        }
        const codigo = `${prefijo}-${String(nuevoNumero).padStart(3, '0')}`;
        return codigo;
    }
}