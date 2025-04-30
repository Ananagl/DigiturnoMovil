import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SeleccionTurnoComponent } from './pages/seleccion-turno/seleccion-turno.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'seleccion-turno',
    pathMatch: 'full'
  },
  {
    path: 'seleccion-turno',
    component: SeleccionTurnoComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { } 