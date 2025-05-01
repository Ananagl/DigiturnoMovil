import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { TurnoStateService, TurnoData } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';
import { TipoTurno, SubTipoTurno, TIPOS_TURNO, SUBTIPOS_TURNO } from '../interfaces/turno.interface';

@Component({
  selector: 'app-confirmar-turno',
  templateUrl: './confirmar-turno.html',
  styleUrls: ['./confirmar-turno.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BannerGlobalComponent]
})
export class ConfirmarTurnoComponent implements OnInit {
  datos!: TurnoData;
  tipoNombre = '';
  subtipoNombre = '';
  resultado: { id: number; message: string } | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private turnoState: TurnoStateService,
    private turnoApi: TurnoApiService
  ) {}

  ngOnInit() {
    this.datos = this.turnoState.getTurnoData();
    // Mapear IDs a nombres
    const tipo = TIPOS_TURNO.find(t => t.id === this.datos.tipo_turno_id);
    this.tipoNombre = tipo ? tipo.nombre : 'N/A';
    const subtipo = SUBTIPOS_TURNO.find(s => s.id === this.datos.subtipo_turno_id!);
    this.subtipoNombre = subtipo ? subtipo.nombre : '-';
  }

  confirmar() {
    this.cargando = true;
    this.error = null;

    this.turnoApi.crear(this.datos).subscribe(
      res => {
        this.resultado = res;
        this.cargando = false;
      },
      err => {
        this.error = err.error?.error || err.message || 'Error al guardar turno';
        this.cargando = false;
      }
    );
  }
}