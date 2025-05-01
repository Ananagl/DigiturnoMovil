import { Injectable } from '@angular/core';

export interface TurnoData {
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  tipo_turno_id: number;
  subtipo_turno_id: number | null;
}

@Injectable({ providedIn: 'root' })
export class TurnoStateService {
  private data: Partial<TurnoData> = {};

  setDocumento(tipo: string, numero: string) {
    this.data.tipo_documento = tipo;
    this.data.numero_documento = numero;
  }

  setNombresApellidos(nombres: string, apellidos: string) {
    this.data.nombres = nombres;
    this.data.apellidos = apellidos;
  }

  setTipoTurno(tipoId: number, subtipoId: number | null) {
    this.data.tipo_turno_id = tipoId;
    this.data.subtipo_turno_id = subtipoId;
  }

  getTurnoData(): TurnoData {
    return {
      tipo_documento: this.data.tipo_documento!,
      numero_documento: this.data.numero_documento!,
      nombres: this.data.nombres!,
      apellidos: this.data.apellidos!,
      tipo_turno_id: this.data.tipo_turno_id!,
      subtipo_turno_id: this.data.subtipo_turno_id ?? null
    };
  }
}
