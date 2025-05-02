import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { TurnoStateService, TurnoData } from '../services/turno.service';
import { TurnoApiService } from '../services/turno-api.service';
import { TIPOS_TURNO, SUBTIPOS_TURNO } from '../interfaces/turno.interface';
import { Router } from '@angular/router';  
import { DomSanitizer } from '@angular/platform-browser';

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
  cargando = false;
  error: string | null = null;

  constructor(
    private turnoState: TurnoStateService,
    private turnoApi: TurnoApiService,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer,
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
    this.error   = null;

    this.turnoApi.crear(this.datos).subscribe({
      next: async (res) => {
        this.cargando = false;
        const msg = `ID: ${res.id}<br>${res.message}`;
        await this.presentResultAlert(true, msg);
      },
      error: async (err) => {
        this.cargando = false;
        const errMsg = err.error?.error || err.message || 'Error al guardar turno';
        await this.presentResultAlert(false, errMsg);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  private async presentResultAlert(
    success: boolean,
    messageHtml: string = ''
  ) {
    const iconSrc = success
      ? '/assets/icon/ACEPTADO.svg'
      : '/assets/icon/CANCELADO.svg';

    const html = `
      <div class="alert-icon">
        <img
          src="${iconSrc}"
          alt="${success ? 'Aceptado' : 'Cancelado'}"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="alert-text">${messageHtml}</div>
    `;

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);

    const alert = await this.alertCtrl.create({
      header: success ? '✅ Turno asignado' : '❌ Turno denegado',
      message: safeHtml as any,
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [
        { text: 'Ir al inicio', handler: () => this.router.navigate(['/home']) }
      ]
    });
    await alert.present();
  }
}
