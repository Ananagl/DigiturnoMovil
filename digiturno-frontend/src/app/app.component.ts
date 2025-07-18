import { Component, OnInit } from '@angular/core';
import { IonApp, IonSpinner, IonText, IonButton, IonContent } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { ConnectionService } from './services/connection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, RouterOutlet, IonSpinner, IonText, IonButton, IonContent, CommonModule],
})
export class AppComponent implements OnInit {
  isCheckingConnection = true;
  isServerAvailable = false;
  connectionError = false;
  debugLogs: string[] = [];

  constructor(private connectionService: ConnectionService) {
    this.addLog('🚀 AppComponent inicializado');
    this.addLog('🔧 ConnectionService inyectado');
    
    // Conectar el callback de logs del servicio
    this.connectionService.setLogCallback((message: string) => {
      this.addLog(message);
    });
  }

  ngOnInit() {
    this.addLog('📱 ngOnInit ejecutado');
    this.addLog('⏰ Iniciando verificación de conexión en 2 segundos...');
    
    // Forzar que la pantalla de carga se muestre por al menos 2 segundos
    setTimeout(() => {
      this.addLog('🔄 Ejecutando checkServerConnection...');
      this.checkServerConnection();
    }, 2000);
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.debugLogs.push(`[${timestamp}] ${message}`);
    console.log(message);
    
    // Mantener solo los últimos 20 logs
    if (this.debugLogs.length > 20) {
      this.debugLogs = this.debugLogs.slice(-20);
    }
  }

  checkServerConnection() {
    this.addLog('🔍 === INICIANDO VERIFICACIÓN DE CONEXIÓN ===');
    this.addLog(`📊 Estado actual: isCheckingConnection=${this.isCheckingConnection}, isServerAvailable=${this.isServerAvailable}, connectionError=${this.connectionError}`);
    
    this.isCheckingConnection = true;
    this.connectionError = false;
    this.isServerAvailable = false;
    
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
