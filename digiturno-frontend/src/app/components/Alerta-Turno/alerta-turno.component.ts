import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerta-turno',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './alerta-turno.component.html',
  styleUrls: ['./alerta-turno.component.scss']
})
export class AlertaTurnoComponent {
  @Input() success: boolean = true;
  @Input() message: string = '';

  get iconSrc(): string {
    return this.success
      ? '/assets/icon/aceptado.svg'
      : '/assets/icon/cancelado.svg';
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
