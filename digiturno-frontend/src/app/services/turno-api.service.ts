import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TurnoData } from './turno.service';
import { Observable } from 'rxjs';

interface CrearResponse {
  id: number;
  message: string;
}

interface ExisteResponse {
  existe: boolean;
}
export interface TurnoListado {
  nombres: string;
  apellidos: string;
  tipo_turno: string;
  fecha_creacion: string; // ISO string
}

@Injectable({ providedIn: 'root' })
export class TurnoApiService {
  private base = 'http://localhost:3000/turnos';

  constructor(private http: HttpClient) {}

  verificarExiste(documento: string): Observable<ExisteResponse> {
    return this.http.get<ExisteResponse>(`${this.base}/turno-existe/${documento}`);
  }

  crear(turno: TurnoData): Observable<CrearResponse> {
    return this.http.post<CrearResponse>(this.base, turno);
  }
  obtenerPersona(tipo: string, numero: string) {
    return this.http.get<{ nombres: string; apellidos: string }>(
      `${this.base}/datos/${tipo}/${numero}`
    );
  }
  listarAsignados(dias: number = 14): Observable<TurnoListado[]> {
    return this.http.get<TurnoListado[]>(
      `${this.base}/asignados?dias=${dias}`
    );
  }
}

