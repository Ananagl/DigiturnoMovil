import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TurnoApiService, TurnoListado } from '../services/turno-api.service';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

// Extender la interfaz para incluir información del documento
interface TurnoConDocumento extends TurnoListado {
  tipo_documento: string;
  numero_documento: string;
}

@Component({
  selector: 'app-lista-turnos',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, BannerGlobalComponent, ArrowNavComponent],
  templateUrl: './lista-turnos.html',
  styleUrls: ['./lista-turnos.scss'],
})
export class ListaTurnosComponent implements OnInit {
  turnos: TurnoConDocumento[] = [];
  turnosFiltrados: TurnoConDocumento[] = [];
  cargando = false;
  error = false;
  mensajeError = '';
  terminoBusqueda = '';
  filtroActivo = 'todos';

  constructor(private turnoApi: TurnoApiService) {}

  ngOnInit() {
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.cargando = true;
    this.error = false;
    this.mensajeError = '';
    
    console.log('🔄 Cargando turnos...');
    
    this.turnoApi.listarAsignados(14).subscribe({
      next: (data) => {
        console.log('✅ Turnos cargados exitosamente:', data);
        this.turnos = data as TurnoConDocumento[];
        this.turnosFiltrados = [...this.turnos];
        this.cargando = false;
        console.log('📊 Turnos con documentos:', this.turnos);
      },
      error: (err) => {
        console.error('❌ Error al cargar turnos:', err);
        this.error = true;
        this.mensajeError = 'Error al cargar los turnos. Por favor, intenta de nuevo.';
        this.cargando = false;
      }
    });
  }

  // Método para aplicar filtro por tipo de turno
  aplicarFiltro(tipo: string) {
    console.log('🔍 Aplicando filtro:', tipo);
    this.filtroActivo = tipo;
    this.filtrarTurnos();
  }

  // Método para filtrar turnos (combina filtro por tipo y búsqueda)
  filtrarTurnos() {
    console.log('🔍 Filtrando turnos...');
    console.log('📝 Término de búsqueda:', this.terminoBusqueda);
    console.log('🎯 Filtro activo:', this.filtroActivo);
    
    let turnosFiltrados = [...this.turnos];

    // Aplicar filtro por tipo de turno
    if (this.filtroActivo !== 'todos') {
      turnosFiltrados = turnosFiltrados.filter(turno => {
        const tipoTurno = turno.tipo_turno.toLowerCase();
        console.log('🔍 Verificando turno:', turno.nombres, 'tipo:', tipoTurno);
        
        switch (this.filtroActivo) {
          case 'general':
            return tipoTurno.includes('general');
          case 'preferencial':
            return tipoTurno.includes('preferencial') || tipoTurno.includes('prioritario');
          case 'otros':
            return tipoTurno.includes('otros');
          default:
            return true;
        }
      });
    }

    // Aplicar búsqueda por texto
    if (this.terminoBusqueda && this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      console.log('🔍 Buscando término:', termino);
      
      turnosFiltrados = turnosFiltrados.filter(turno => {
        const nombreCompleto = `${turno.nombres} ${turno.apellidos}`.toLowerCase();
        const tipoDocumento = (turno.tipo_documento || '').toLowerCase();
        const numeroDocumento = (turno.numero_documento || '').toLowerCase();
        
        const coincide = nombreCompleto.includes(termino) || 
               tipoDocumento.includes(termino) ||
               numeroDocumento.includes(termino) ||
               turno.nombres.toLowerCase().includes(termino) ||
               turno.apellidos.toLowerCase().includes(termino);
        
        console.log('🔍 Verificando:', turno.nombres, 'coincide:', coincide);
        return coincide;
      });
    }

    console.log('✅ Turnos filtrados:', turnosFiltrados.length);
    this.turnosFiltrados = turnosFiltrados;
  }

  // Método para limpiar la búsqueda
  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtrarTurnos();
  }

  // Método para limpiar todos los filtros
  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroActivo = 'todos';
    this.turnosFiltrados = [...this.turnos];
  }

  // Método para recargar los turnos
  recargarTurnos() {
    this.limpiarFiltros();
    this.cargarTurnos();
  }
}