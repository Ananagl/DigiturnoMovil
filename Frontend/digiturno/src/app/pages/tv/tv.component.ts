import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvNavbarComponent } from '../../components/tv-navbar/tv-navbar.component';
import { TurnosComponent } from '../../components/turnos/turnos.component';

@Component({
  selector: 'app-tv',
  standalone: true,
  imports: [CommonModule, TvNavbarComponent, TurnosComponent],
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.css']
})
export class TvComponent {

}
