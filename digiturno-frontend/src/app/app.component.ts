import { Component } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, RouterOutlet],
})
export class AppComponent {
  constructor() {}
}
