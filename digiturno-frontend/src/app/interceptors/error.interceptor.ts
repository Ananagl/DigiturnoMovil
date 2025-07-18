import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔍 === INTERCEPTOR DE ERRORES ===');
    console.log('📋 Interceptando petición:', {
      method: request.method,
      url: request.url,
      headers: request.headers.keys(),
      body: request.body
    });
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ === ERROR INTERCEPTADO ===');
        console.error('📋 Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          console.error('🌐 Error del lado del cliente:', error.error.message);
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          console.error('🖥️ Error del lado del servidor:', error.status);
          
          switch (error.status) {
            case 0:
              console.error('🌐 Error 0: No se pudo conectar al servidor');
              errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
              break;
            case 404:
              console.error('🚫 Error 404: Ruta no encontrada');
              errorMessage = 'El recurso solicitado no fue encontrado.';
              break;
            case 500:
              console.error('💥 Error 500: Error interno del servidor');
              errorMessage = 'Error interno del servidor. Intenta más tarde.';
              break;
            case 503:
              console.error('🔧 Error 503: Servidor no disponible');
              errorMessage = 'El servidor no está disponible en este momento.';
              break;
            default:
              console.error(`⚠️ Error ${error.status}: ${error.message}`);
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        console.error('📋 Error HTTP completo:', error);
        console.error('📋 Mensaje de error final:', errorMessage);
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
} 