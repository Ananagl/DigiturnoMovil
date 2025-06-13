import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';
import { TurnoStateService } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-turno-2',
  templateUrl: './nuevo-turno-2.html',
  styleUrls: ['./nuevo-turno-2.scss'],
  standalone: true,
  imports: [FormsModule, BannerGlobalComponent, ArrowNavComponent, IonicModule, CommonModule],
})
export class NuevoTurno2Component implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  cargandoDatos = false;
  activeInput: 'nombres' | 'apellidos' = 'nombres';

  // Teclado QWERTY en mayúsculas
  keypadRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    [' ']
  ];

  constructor(
    private turnoState: TurnoStateService,
    private turnoApi: TurnoApiService
  ) {}

  guardarNombresApellidos() {
    this.turnoState.setNombresApellidos(this.nombres, this.apellidos);
  }

  ngOnInit() {
    // Intentamos autocompletar
    const data = this.turnoState.getTurnoData();
    if (data.tipo_documento && data.numero_documento) {
      this.cargandoDatos = true;
      this.turnoApi
        .obtenerPersona(data.tipo_documento, data.numero_documento)
        .subscribe({
          next: persona => {
            if (persona) {
              this.nombres = persona.nombres;
              this.apellidos = persona.apellidos;
              // Actualizamos también el estado
              this.turnoState.setNombresApellidos(
                persona.nombres,
                persona.apellidos
              );
            }
            this.cargandoDatos = false;
          },
          error: () => {
            // Silencioso: el usuario ingresará manualmente
            this.cargandoDatos = false;
          }
        });
    }
  }

  onInputNombre(event: any) {
    let value = event.detail.value.replace(/[^a-zA-ZñÑ\s]/g, '');
    if (value.length > 50) value = value.slice(0, 50);
    this.nombres = value;
  }

  onInputApellido(event: any) {
    let value = event.detail.value.replace(/[^a-zA-ZñÑ\s]/g, '');
    if (value.length > 50) value = value.slice(0, 50);
    this.apellidos = value;
  }

  onKeypadPress(key: string) {
    if (key === ' ') {
      // No permitir espacio al inicio
      if (this.activeInput === 'nombres' && this.nombres.length === 0) {
        return;
      }
      if (this.activeInput === 'apellidos' && this.apellidos.length === 0) {
        return;
      }
    }

    if (this.activeInput === 'nombres' && this.nombres.length < 50) {
      this.nombres += key;
    } else if (this.activeInput === 'apellidos' && this.apellidos.length < 50) {
      this.apellidos += key;
    }
  }

  clearInput() {
    if (this.activeInput === 'nombres') {
      this.nombres = '';
    } else {
      this.apellidos = '';
    }
  }

  deleteLastDigit() {
    if (this.activeInput === 'nombres') {
      this.nombres = this.nombres.slice(0, -1);
    } else {
      this.apellidos = this.apellidos.slice(0, -1);
    }
  }

  setActiveInput(input: 'nombres' | 'apellidos') {
    this.activeInput = input;
  }

  isNextDisabled(): boolean {
    return !this.nombres || !this.apellidos;
  }
}
