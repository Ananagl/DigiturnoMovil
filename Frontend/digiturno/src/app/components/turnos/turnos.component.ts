import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Turno {
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  // Turno actual que se está llamando
  turnoActual: Turno | null = null;

  // Lista de próximos turnos
  turnosSiguientes: Turno[] = [];

  // Datos de ejemplo (simulando datos del backend)
  private mockData: Turno[] = [
    { codigo: 'P01', nombre: 'JUAN CAMACHO' },
    { codigo: 'P02', nombre: 'MARÍA LÓPEZ' },
    { codigo: 'P03', nombre: 'CARLOS RUIZ' },
    { codigo: 'P04', nombre: 'ANA MARTÍNEZ' },
    { codigo: 'P05', nombre: 'PEDRO SÁNCHEZ' }
  ];

  ngOnInit() {
    // Simulamos la recepción de datos
    this.actualizarTurnos(this.mockData);
  }

  actualizarTurnos(turnos: Turno[]) {
    if (turnos.length > 0) {
      // El primer turno es el actual
      this.turnoActual = turnos[0];
      
      // Los siguientes turnos (máximo 4)
      this.turnosSiguientes = turnos.slice(1, 5);
    } else {
      this.turnoActual = null;
      this.turnosSiguientes = [];
    }
  }
}
