import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';

@Component({
  selector: 'app-turno-resultado',
  templateUrl: './turno-resultado.html',
  styleUrls: ['./turno-resultado.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, BannerGlobalComponent]
})
export class TurnoResultadoComponent implements OnInit {
  resultado: { id: number; message: string } | null = null;
  error: string | null = null;

  constructor(
    private router: Router,
    
  ) {}

  ngOnInit() {
    // 1) Leer estado pasado desde /confirmar-turno
    const state = history.state as any;
    this.resultado = state.resultado ?? null;
    this.error     = state.error     ?? null;

  }


  reiniciar() {
    this.router.navigate(['/home']);
  }
}
