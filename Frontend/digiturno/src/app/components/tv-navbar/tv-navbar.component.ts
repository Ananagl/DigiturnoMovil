import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tv-navbar',
  templateUrl: './tv-navbar.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class TvNavbarComponent implements OnInit, OnDestroy {
  currentTurn: string = 'A001';
  currentModule: string = 'Consultorio 1';
  currentTime: string = '';
  private timer: any;

  constructor() { }

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  updateTurn(turn: string): void {
    this.currentTurn = turn;
  }

  updateModule(module: string): void {
    this.currentModule = module;
  }
} 