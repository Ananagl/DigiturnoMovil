import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TurnoApiService, TurnoListado } from '../services/turno-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lista-turnos',
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe],
  templateUrl: './lista-turnos.html',
  styleUrls: ['./lista-turnos.scss'],
})
export class ListaTurnoscomponent implements OnInit {
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