import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TurnoListado {
  nombres: string;
  apellidos: string;
  tipo_turno: string;
  fecha_creacion: string;
  tipo_documento: string;
  numero_documento: string;
}

export interface CrearResponse {
  id: number;
  message: string;
}

export interface ExisteResponse {
  existe: boolean;
}

export interface PersonaResponse {
  nombres: string;
  apellidos: string;
}

@Injectable({
  providedIn: 'root'
})
export class TurnoApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  validarDocumento(tipo_documento: string, numero_documento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar-documento`, {
      tipo_documento,
      numero_documento
    });
  }

  crear(turnoData: any): Observable<CrearResponse> {
    // Mapear los campos para que coincidan con lo que espera el backend
    const turnoMapeado = {
      nombres: turnoData.nombres,
      apellidos: turnoData.apellidos,
      tipo_documento: turnoData.tipo_documento,
      numero_documento: turnoData.numero_documento,
      tipo_turno_id: turnoData.tipo_turno_id,
      subtipo_turno_id: turnoData.subtipo_turno_id
    };
    return this.http.post<CrearResponse>(`${this.apiUrl}/turnos`, turnoMapeado);
  }

  getTiposTurno(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tipos-turno`);
  }

  obtenerPersona(tipo: string, numero: string): Observable<PersonaResponse> {
    // Añadir manejo de errores con catchError
    return this.http.get<PersonaResponse>(`${this.apiUrl}/turnos/datos/${tipo}/${numero}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener datos de persona:', error);
          // Devolver un objeto vacío para que el usuario pueda ingresar los datos manualmente
          return of({ nombres: '', apellidos: '' });
        })
      );
  }

  listarAsignados(dias: number = 14): Observable<TurnoListado[]> {
    return this.http.get<TurnoListado[]>(`${this.apiUrl}/turnos/asignados?dias=${dias}`);
  }

  verificarExiste(documento: string): Observable<ExisteResponse> {
    return this.http.get<ExisteResponse>(`${this.apiUrl}/turnos/turno-existe/${documento}`);
  }
}

