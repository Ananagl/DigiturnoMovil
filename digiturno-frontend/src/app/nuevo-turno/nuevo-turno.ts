import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.html',
  styleUrls: ['./nuevo-turno.scss'],
  standalone: true,
  imports: [FormsModule, BannerGlobalComponent, ArrowNavComponent], 
})
export class NuevoTurnoComponent {
  tipoId: string = '';
  numeroDoc: string = '';

  onInputNumber(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 15) value = value.slice(0, 15);
    this.numeroDoc = value;
    event.target.value = value;
  }

  isNextDisabled(): boolean {
    return !this.tipoId || !this.numeroDoc || this.numeroDoc.length === 0;
  }
}