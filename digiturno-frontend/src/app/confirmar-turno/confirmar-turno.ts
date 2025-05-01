import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { TurnoStateService, TurnoData } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';

@Component({
  selector: 'app-confirmar-turno',
  templateUrl: './confirmar-turno.html',
  styleUrls: ['./confirmar-turno.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BannerGlobalComponent]
})
export class ConfirmarTurnoComponent implements OnInit {
  datos!: TurnoData;
  resultado: { id: number; message: string } | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private turnoState: TurnoStateService,
    private turnoApi: TurnoApiService
  ) {}

  ngOnInit() {
    this.datos = this.turnoState.getTurnoData();
  }

  confirmar() {
    this.cargando = true;
    this.error = null;

    this.turnoApi.crear(this.datos).subscribe(
      (res) => {
        this.resultado = res;
        this.cargando = false;
      },
      (err) => {
        this.error = err.error?.error || err.message || 'Error al guardar turno';
        this.cargando = false;
      }
    );
  }
}

