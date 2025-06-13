import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonImg
} from '@ionic/angular/standalone';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonImg,
    BannerGlobalComponent
  ],
})
export class HomePage {
  constructor(private router: Router) {}

  goToNuevoTurno() {
    this.router.navigate(['/nuevo-turno']);
  }
  gotolistarturno(){
    this.router.navigate(['/lista-turnos']);
  }
}
