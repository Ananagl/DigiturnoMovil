import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'nuevo-turno',
    loadComponent: () => import('./nuevo-turno/nuevo-turno').then((m) => m.NuevoTurnoComponent),
  },
  {
    path: 'nuevo-turno-2',
    loadComponent: () => import('./nuevo-turno-2/nuevo-turno-2').then((m) => m.NuevoTurno2Component),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
