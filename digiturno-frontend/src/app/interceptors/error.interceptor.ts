import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 0:
              errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
              break;
            case 404:
              errorMessage = 'El recurso solicitado no fue encontrado.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intenta más tarde.';
              break;
            case 503:
              errorMessage = 'El servidor no está disponible en este momento.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        console.error('Error HTTP:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
} 