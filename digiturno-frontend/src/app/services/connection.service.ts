import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Verifica si el servidor está disponible
   * @param timeoutMs Tiempo máximo de espera en milisegundos (default: 5000ms)
   */
  checkServerConnection(timeoutMs: number = 5000): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/health`)
      .pipe(
        timeout(timeoutMs),
        map(() => true),
        catchError(() => of(false))
      );
  }

  /**
   * Verifica la conexión y retorna un observable con el estado
   */
  isServerAvailable(): Observable<boolean> {
    return this.checkServerConnection();
  }
} 