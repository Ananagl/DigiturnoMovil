import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BannerGlobalComponent } from './app/components/banner-global/banner-global.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, BannerGlobalComponent],
})
export class AppComponent {
  constructor() {}
}
