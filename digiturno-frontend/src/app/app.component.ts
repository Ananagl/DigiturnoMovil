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

  constructor(private connectionService: ConnectionService) {}

  ngOnInit() {
    // Forzar que la pantalla de carga se muestre por al menos 2 segundos
    setTimeout(() => {
      this.checkServerConnection();
    }, 2000);
  }

  checkServerConnection() {
    this.isCheckingConnection = true;
    this.connectionError = false;
    this.isServerAvailable = false;
    
    console.log('🔍 Verificando conexión al servidor...');
    
    this.connectionService.checkServerConnection(8000).subscribe({
      next: (isAvailable) => {
        console.log('✅ Resultado de verificación:', isAvailable);
        this.isServerAvailable = isAvailable;
        this.isCheckingConnection = false;
        if (!isAvailable) {
          this.connectionError = true;
          console.log('❌ Servidor no disponible');
        } else {
          console.log('✅ Servidor disponible');
        }
      },
      error: (error) => {
        console.error('❌ Error al verificar conexión:', error);
        this.isServerAvailable = false;
        this.isCheckingConnection = false;
        this.connectionError = true;
      }
    });
  }

  retryConnection() {
    console.log('🔄 Reintentando conexión...');
    this.checkServerConnection();
  }
}
