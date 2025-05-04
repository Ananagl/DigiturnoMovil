import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';
import { TurnoStateService } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';
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

  cargandoDatos = false;

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
