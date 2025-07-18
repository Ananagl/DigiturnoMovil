import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { TurnoStateService, TurnoData } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';
import { TIPOS_TURNO, SUBTIPOS_TURNO } from '../interfaces/turno.interface';
import { Router } from '@angular/router';  
import { ModalController } from '@ionic/angular';
import { AlertaTurnoComponent } from '../components/Alerta-Turno/alerta-turno.component';

@Component({
  selector: 'app-confirmar-turno',
  templateUrl: './confirmar-turno.html',
  styleUrls: ['./confirmar-turno.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BannerGlobalComponent, AlertaTurnoComponent]
})
export class ConfirmarTurnoComponent implements OnInit {
  datos!: TurnoData;
  tipoNombre = '';
  subtipoNombre = '';
  cargando = false;
  error: string | null = null;

  constructor(
    private turnoState: TurnoStateService,
    private turnoApi: TurnoApiService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router  
  ) {}

  ngOnInit() {
    this.datos = this.turnoState.getTurnoData();
    const tipo = TIPOS_TURNO.find(t => t.id === this.datos.tipo_turno_id);
    this.tipoNombre = tipo ? tipo.nombre : 'N/A';
    const subtipo = SUBTIPOS_TURNO.find(s => s.id === this.datos.subtipo_turno_id!);
    this.subtipoNombre = subtipo ? subtipo.nombre : '-';
  }

  async confirmar() {
    this.cargando = true;
    this.error = null;
    
    // Log para debug
    console.log('🔍 Intentando enviar turno a:', this.turnoApi['apiUrl']);
    console.log('🔍 Datos del turno:', this.datos);
    
    this.turnoApi.crear(this.datos).subscribe({
      next: async (res) => {
        console.log('✅ Respuesta exitosa:', res);
        this.cargando = false;
        const msg = `ID: ${res.id}<br>${res.message}`;
        await this.presentResultAlert(true, msg);
      },
      error: async (err) => {
        console.log('❌ Error al enviar turno:', err);
        this.cargando = false;
        const errMsg = err.error?.error || err.message || 'Error al guardar turno';
        await this.presentResultAlert(false, errMsg);
      }
    });
  }

  async cerrar() {  
    await this.router.navigate(['/home']);
  }


  private async presentResultAlert(success: boolean, message: string) {
    const modal = await this.modalCtrl.create({
      component: AlertaTurnoComponent,
      cssClass: 'transparent-modal',
      componentProps: {
        success,
        message
      },
      backdropDismiss: false
    });
    
    await modal.present();
  }
}