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
}
