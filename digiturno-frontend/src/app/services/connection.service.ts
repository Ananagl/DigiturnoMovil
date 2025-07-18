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
    const healthUrl = `${this.apiUrl}/health`;
    console.log('🌐 Intentando conectar a:', healthUrl);
    
    return this.http.get(healthUrl)
      .pipe(
        timeout(timeoutMs),
        map((response) => {
          console.log('✅ Respuesta del servidor:', response);
          return true;
        }),
        catchError((error) => {
          console.error('❌ Error de conexión:', error);
          if (error.name === 'TimeoutError') {
            console.error('⏰ Timeout después de', timeoutMs, 'ms');
          }
          return of(false);
        })
      );
  }

  /**
   * Verifica la conexión y retorna un observable con el estado
   */
  isServerAvailable(): Observable<boolean> {
    return this.checkServerConnection();
  }
} 