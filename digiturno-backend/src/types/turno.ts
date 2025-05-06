import { RowDataPacket } from 'mysql2/promise';
// Definir interfaces para los datos y resultados
export interface TurnoData {
    nombres: string;
    apellidos: string;
    tipo_documento: string;
    numero_documento: string;
    tipo_turno_id: number;  
    subtipo_turno_id?: number;
  }
  
 export interface PersonaEncontrada extends RowDataPacket {
    nombres: string;
    apellidos: string;
  }
 export interface Turno extends RowDataPacket {
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
  
 export interface TurnoExistente extends RowDataPacket {
    total: number;
  }
  
export  interface EstadisticaTurno extends RowDataPacket {
    tipo_turno: string;
    cantidad: number;
  }
  
export  interface TurnoListado extends RowDataPacket {
    nombres: string;
    apellidos: string;
    tipo_turno: string;
    fecha_creacion: Date;
  }