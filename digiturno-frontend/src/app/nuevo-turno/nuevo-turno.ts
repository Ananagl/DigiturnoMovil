import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';
import { TurnoStateService } from '../services/turno.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.html',
  styleUrls: ['./nuevo-turno.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    BannerGlobalComponent, 
    ArrowNavComponent,
    CommonModule,
    IonicModule, // ¡Esto es suficiente!
  ], 
})
export class NuevoTurnoComponent {
  tipoId: string = '';
  numeroDoc: string = '';
  keypadRows: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ];

  constructor(
    private router: Router,
    private turnoState: TurnoStateService
  ) {}

  onInputNumber(event: any) {
    const value = event.detail.value;
    this.numeroDoc = value.replace(/[^0-9]/g, '');
  }

  onKeypadPress(key: string) {
    if (this.numeroDoc.length < 15) {
      this.numeroDoc += key;
    }
  }

  clearInput() {
    this.numeroDoc = '';
  }

  deleteLastDigit() {
    this.numeroDoc = this.numeroDoc.slice(0, -1);
  }

  isNextDisabled(): boolean {
    return !this.tipoId || !this.numeroDoc;
  }

  guardarDocumento() {
    this.turnoState.setDocumento(this.tipoId, this.numeroDoc);
  }
}