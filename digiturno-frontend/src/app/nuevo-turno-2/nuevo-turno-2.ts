import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

@Component({
  selector: 'app-nuevo-turno-2',
  templateUrl: './nuevo-turno-2.html',
  styleUrls: ['./nuevo-turno-2.scss'],
  standalone: true,
  imports: [FormsModule, BannerGlobalComponent, ArrowNavComponent],
})
export class NuevoTurno2Component implements OnInit {
  nombres: string = '';
  apellidos: string = '';

  constructor() {}

  ngOnInit() {}

  onInputNombre(event: any) {
    let value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    if (value.length > 50) value = value.slice(0, 50);
    this.nombres = value;
    event.target.value = value;
  }

  onInputApellido(event: any) {
    let value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    if (value.length > 50) value = value.slice(0, 50);
    this.apellidos = value;
    event.target.value = value;
  }

  isNextDisabled(): boolean {
    return !this.nombres || !this.apellidos;
  }
}
