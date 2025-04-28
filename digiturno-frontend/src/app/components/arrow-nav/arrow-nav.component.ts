import { Component, Input } from '@angular/core';
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
  @Input() route: string = '/';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;

  constructor(private router: Router) {}

  navigate() {
    if (!this.disabled) {
      this.router.navigate([this.route]);
    }
  }
}