import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerta-turno',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './alerta-turno.component.html',
  styleUrls: ['./alerta-turno.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertaTurnoComponent {
  @Input() success: boolean = true;
  @Input() message: string = '';
  @Input() codigo_turno: string = '';

  get iconSrc(): string {
    return this.success
      ? '/assets/icon/aceptado.svg'
      : '/assets/icon/cancelado.svg';
  }

  get turnCode(): string {
    const match = this.message.match(/Código: ([A-Z]-\d+)/);
    return match ? match[1] : '';
  }

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  async cerrar() {
    await this.modalCtrl.dismiss(); 
    setTimeout(() => {
      this.router.navigate(['/home']); 
    }, 200); 
  }

}
