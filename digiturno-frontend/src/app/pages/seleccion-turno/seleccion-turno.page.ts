import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BannerGlobalComponent } from '../../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../../components/arrow-nav/arrow-nav.component';
import { TipoTurno, SubTipoTurno, TIPOS_TURNO, SUBTIPOS_TURNO } from '../../interfaces/turno.interface';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-seleccion-turno',
  templateUrl: './seleccion-turno.page.html',
  styleUrls: ['./seleccion-turno.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    BannerGlobalComponent,
    ArrowNavComponent
  ]
})
export class SeleccionTurnoPage {
  tiposTurno = TIPOS_TURNO;
  subtiposTurno = SUBTIPOS_TURNO;
  mostrandoSubtipos = false;
  subtiposActuales: SubTipoTurno[] = [];
  tipoSeleccionado?: TipoTurno;
  subtipoSeleccionado?: SubTipoTurno;

  constructor(private router: Router) {}

  // Método para verificar si se puede continuar
  puedeAvanzar(): boolean {
    if (!this.tipoSeleccionado) return false;

    // Si es turno general (no tiene subtipos)
    if (!this.tipoSeleccionado.tieneSubtipos) {
      return true;
    }

    // Si es preferencial o otros, debe tener un subtipo seleccionado
    return this.subtipoSeleccionado !== undefined;
  }

  seleccionarTipo(tipo: TipoTurno) {
    this.tipoSeleccionado = tipo;
    this.subtipoSeleccionado = undefined; // Resetear subtipo al cambiar de tipo

    if (tipo.tieneSubtipos) {
      this.subtiposActuales = this.subtiposTurno.filter(
        subtipo => subtipo.tipoTurnoId === tipo.id
      );
      this.mostrandoSubtipos = true;
    } else {
      this.mostrandoSubtipos = false;
      this.subtiposActuales = [];
    }
  }

  seleccionarSubtipo(subtipoId: number) {
    this.subtipoSeleccionado = this.subtiposActuales.find(sub => sub.id === subtipoId);
  }

  volverATipos() {
    this.mostrandoSubtipos = false;
    this.tipoSeleccionado = undefined;
    this.subtipoSeleccionado = undefined;
    this.subtiposActuales = [];
  }

  getIconPath(iconName: string): string {
    return `assets/icon/${iconName}.svg`;
  }

  private continuarRegistro(turnoId: number) {
    this.router.navigate(['/siguiente-ruta'], { 
      queryParams: { turnoId: turnoId }
    });
  }
} 