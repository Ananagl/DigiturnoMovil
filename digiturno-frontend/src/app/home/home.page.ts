import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, BannerGlobalComponent],
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
