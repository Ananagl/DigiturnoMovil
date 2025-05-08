import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TurnoApiService, TurnoListado } from '../services/turno-api.service';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

@Component({
  selector: 'app-lista-turnos',
  standalone: true,
  imports: [CommonModule, IonicModule,  BannerGlobalComponent, ArrowNavComponent],
  templateUrl: './lista-turnos.html',
  styleUrls: ['./lista-turnos.scss'],
})
export class ListaTurnosComponent implements OnInit {
  turnos: TurnoListado[] = [];
  cargando = false;

  constructor(private turnoApi: TurnoApiService) {}

  ngOnInit() {
    this.cargando = true;
    this.turnoApi.listarAsignados(14).subscribe({
      next: data => {
        this.turnos = data;
        this.cargando = false;
      },
      error: () => {
        // manejar error (mostrar toast, etc.)
        this.cargando = false;
      }
    });
  }
}