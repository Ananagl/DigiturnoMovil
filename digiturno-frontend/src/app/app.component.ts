import { Component, OnInit } from '@angular/core';
import { IonApp, IonSpinner, IonText, IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { ConnectionService } from './services/connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, RouterOutlet, IonSpinner, IonText, IonButton, IonContent, IonIcon, CommonModule],
})
export class AppComponent implements OnInit {
  isCheckingConnection = true;
  isServerAvailable = false;
  connectionError = false;
  debugLogs: string[] = [];
  diagnosticMessage: string = '';

  constructor(private connectionService: ConnectionService) {
    this.addLog('🚀 AppComponent inicializado');
    this.addLog('🔧 ConnectionService inyectado');
    this.connectionService.setLogCallback((message: string) => {
      this.addLog(message);
    });
  }

  ngOnInit() {
    this.addLog('📱 ngOnInit ejecutado');
    this.addLog('⏰ Iniciando verificación de conexión en 2 segundos...');
    setTimeout(() => {
      this.addLog('🔄 Ejecutando checkServerConnection...');
      this.checkServerConnection();
    }, 2000);
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.debugLogs.push(`[${timestamp}] ${message}`);
    console.log(message);
    if (this.debugLogs.length > 30) {
      this.debugLogs = this.debugLogs.slice(-30);
    }
  }

  checkServerConnection() {
    this.addLog('🔍 === INICIANDO VERIFICACIÓN DE CONEXIÓN ===');
    this.addLog(`📊 Estado actual: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
    this.isCheckingConnection = true;
    this.connectionError = false;
    this.isServerAvailable = false;
    this.diagnosticMessage = '';
    this.addLog('🔍 Verificando conexión al servidor...');
    this.addLog('⏰ Timeout configurado: 8000ms');
    this.connectionService.checkServerConnection(8000).subscribe({
      next: (isAvailable) => {
        this.addLog('✅ === RESULTADO DE VERIFICACIÓN ===');
        this.addLog(`📊 Resultado: ${isAvailable}`);
        this.addLog(`📊 Estado anterior: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
        this.isServerAvailable = isAvailable;
        this.isCheckingConnection = false;
        if (!isAvailable) {
          this.connectionError = true;
          this.diagnosticMessage = 'No se pudo conectar al servidor o la ruta no existe.';
          this.addLog('❌ Servidor no disponible - Mostrando pantalla de error');
        } else {
          this.addLog('✅ Servidor disponible - Mostrando aplicación');
        }
        this.addLog(`📊 Estado final: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
      },
      error: (error) => {
        this.addLog('❌ === ERROR EN VERIFICACIÓN ===');
        this.addLog(`🔍 Error completo: ${JSON.stringify(error, null, 2)}`);
        this.addLog(`📊 Estado anterior: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
        this.isServerAvailable = false;
        this.isCheckingConnection = false;
        this.connectionError = true;
        // Diagnóstico según el error
        if (error && error.status !== undefined) {
          switch (error.status) {
            case 0:
              this.diagnosticMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet o que el servidor esté encendido.';
              break;
            case 401:
              this.diagnosticMessage = 'Acceso denegado (401). Verifica tus credenciales o permisos.';
              break;
            case 403:
              this.diagnosticMessage = 'Acceso prohibido (403). No tienes permisos para acceder a este recurso.';
              break;
            case 404:
              this.diagnosticMessage = 'Ruta no encontrada (404). El endpoint solicitado no existe en el servidor.';
              break;
            case 500:
              this.diagnosticMessage = 'Error interno del servidor (500). Intenta más tarde o contacta al administrador.';
              break;
            default:
              this.diagnosticMessage = `Error HTTP ${error.status}: ${error.statusText || error.message}`;
          }
        } else if (error && error.message && error.message.includes('Timeout')) {
          this.diagnosticMessage = 'Tiempo de espera agotado. El servidor no respondió a tiempo.';
        } else {
          this.diagnosticMessage = 'Error desconocido. Revisa los logs para más detalles.';
        }
        this.addLog(`📊 Estado final después del error: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
      }
    });
  }

  retryConnection() {
    this.addLog('🔄 === REINTENTANDO CONEXIÓN ===');
    this.addLog(`📊 Estado actual antes del reintento: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
    this.checkServerConnection();
  }

  clearLogs() {
    this.debugLogs = [];
    this.addLog('🧹 Logs limpiados');
  }
}
