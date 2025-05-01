import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SeleccionTurnoPage } from './seleccion-turno';
import { BannerGlobalComponent } from '../components/banner-global/banner-global.component';
import { ArrowNavComponent } from '../components/arrow-nav/arrow-nav.component';

describe('SeleccionTurno', () => {
  let component: SeleccionTurnoPage;
  let fixture: ComponentFixture<SeleccionTurnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        SeleccionTurnoPage,
        BannerGlobalComponent,
        ArrowNavComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionTurnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.mostrandoSubtipos).toBeFalse();
    expect(component.subtiposActuales.length).toBe(0);
    expect(component.tipoSeleccionado).toBeUndefined();
  });

  it('should show subtypes when selecting a type with subtypes', () => {
    const tipoConSubtipos = component.tiposTurno.find(t => t.tieneSubtipos);
    if (tipoConSubtipos) {
      component.seleccionarTipo(tipoConSubtipos);
      expect(component.mostrandoSubtipos).toBeTrue();
      expect(component.subtiposActuales.length).toBeGreaterThan(0);
    }
  });

  it('should clear selection when going back', () => {
    component.mostrandoSubtipos = true;
    component.tipoSeleccionado = component.tiposTurno[0];
    
    component.volverATipos();
    
    expect(component.mostrandoSubtipos).toBeFalse();
    expect(component.tipoSeleccionado).toBeUndefined();
  });
}); 