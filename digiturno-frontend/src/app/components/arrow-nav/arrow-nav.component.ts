import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-arrow-nav',
  templateUrl: './arrow-nav.component.html',
  styleUrls: ['./arrow-nav.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class ArrowNavComponent {
  @Input() direction: 'left' | 'right' = 'left';

  /** Ruta a la que navega */
  @Input() route: string = '/';

  /** URL o path del icono */
  @Input() icon: string = '';

  /** Deshabilita el click y añade la clase 'disabled' */
  @Input() disabled: boolean = false;

  /** Hook opcional antes de la navegación */
  @Output() beforeNavigate = new EventEmitter<void>();


  constructor(private router: Router) {}

  navigate() {
    if (this.disabled) return;

    this.beforeNavigate.emit();
    this.router.navigate([this.route]);
  }
}