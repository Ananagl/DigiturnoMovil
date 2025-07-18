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
  private logCallback?: (message: string) => void;

  constructor(private http: HttpClient) {}

  setLogCallback(callback: (message: string) => void) {
    this.logCallback = callback;
  }

  private log(message: string) {
    if (this.logCallback) {
      this.logCallback(message);
    }
    console.log(message);
  }

  /**
   * Verifica si el servidor está disponible
   * @param timeoutMs Tiempo máximo de espera en milisegundos (default: 5000ms)
   */
  checkServerConnection(timeoutMs: number = 5000): Observable<boolean> {
    const healthUrl = `${this.apiUrl}/health`;
    this.log('🌐 Intentando conectar a: ' + healthUrl);
    this.log('🔧 URL completa del API: ' + this.apiUrl);
    this.log('⏰ Timeout configurado: ' + timeoutMs + 'ms');
    
    return this.http.get(healthUrl)
      .pipe(
        timeout(timeoutMs),
        map((response) => {
          this.log('✅ Respuesta del servidor: ' + JSON.stringify(response));
          this.log('✅ Conexión exitosa al servidor');
          return true;
        }),
        catchError((error) => {
          this.log('❌ Error de conexión: ' + JSON.stringify(error));
          this.log('🔍 Detalles del error:');
          this.log('   - Status: ' + error.status);
          this.log('   - StatusText: ' + error.statusText);
          this.log('   - URL intentada: ' + healthUrl);
          this.log('   - Mensaje: ' + error.message);
          this.log('   - Error completo: ' + JSON.stringify(error));
          
          if (error.name === 'TimeoutError') {
            this.log('⏰ Timeout después de ' + timeoutMs + 'ms');
          }
          
          if (error.status === 404) {
            this.log('🚫 Error 404 - Ruta no encontrada');
            this.log('   Verificar que el endpoint /health existe en el backend');
          }
          
          if (error.status === 0) {
            this.log('🌐 Error de red - No se pudo conectar al servidor');
            this.log('   Verificar que el servidor esté corriendo en: ' + this.apiUrl);
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