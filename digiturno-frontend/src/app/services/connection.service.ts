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
    console.log('🔧 URL completa del API:', this.apiUrl);
    console.log('⏰ Timeout configurado:', timeoutMs, 'ms');
    
    return this.http.get(healthUrl)
      .pipe(
        timeout(timeoutMs),
        map((response) => {
          console.log('✅ Respuesta del servidor:', response);
          console.log('✅ Conexión exitosa al servidor');
          return true;
        }),
        catchError((error) => {
          console.error('❌ Error de conexión:', error);
          console.error('🔍 Detalles del error:');
          console.error('   - Status:', error.status);
          console.error('   - StatusText:', error.statusText);
          console.error('   - URL intentada:', healthUrl);
          console.error('   - Mensaje:', error.message);
          console.error('   - Error completo:', error);
          
          if (error.name === 'TimeoutError') {
            console.error('⏰ Timeout después de', timeoutMs, 'ms');
          }
          
          if (error.status === 404) {
            console.error('🚫 Error 404 - Ruta no encontrada');
            console.error('   Verificar que el endpoint /health existe en el backend');
          }
          
          if (error.status === 0) {
            console.error('🌐 Error de red - No se pudo conectar al servidor');
            console.error('   Verificar que el servidor esté corriendo en:', this.apiUrl);
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