import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SeleccionTurnoPage } from './seleccion-turno/seleccion-turno';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'seleccion-turno',
    pathMatch: 'full'
  },
  {
    path: 'seleccion-turno',
    component: SeleccionTurnoPage
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { } 