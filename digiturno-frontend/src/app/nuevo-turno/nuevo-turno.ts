import { Component, OnInit } from '@angular/core';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.html',
  styleUrls: ['./nuevo-turno.scss'],
  imports: [BannerGlobalComponent, ArrowNavComponent],
})

export class NuevoTurnoComponent  implements OnInit {

  onInputNumber(event: any) {
    let value = event.target.value;
    // Elimina cualquier caracter que no sea número
    value = value.replace(/[^0-9]/g, '');
    // Limita a 15 dígitos
    if (value.length > 15) {
      value = value.slice(0, 15);
    }
    event.target.value = value;
  }

  constructor() { }

  ngOnInit() {}

}
