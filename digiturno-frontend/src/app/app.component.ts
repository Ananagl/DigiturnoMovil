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
    this.checkServerConnection();
  }

  checkServerConnection() {
    this.isCheckingConnection = true;
    this.connectionError = false;
    
    this.connectionService.checkServerConnection(10000).subscribe({
      next: (isAvailable) => {
        this.isServerAvailable = isAvailable;
        this.isCheckingConnection = false;
        if (!isAvailable) {
          this.connectionError = true;
        }
      },
      error: () => {
        this.isServerAvailable = false;
        this.isCheckingConnection = false;
        this.connectionError = true;
      }
    });
  }

  retryConnection() {
    this.checkServerConnection();
  }
}
