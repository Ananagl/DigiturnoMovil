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
    path: 'seleccion-turno',
    loadComponent: () => import('./seleccion-turno/seleccion-turno').then((m)=> m.SeleccionTurnoPage),
  },
  { 
    path: 'confirmar-turno', 
    loadComponent: () => import('./confirmar-turno/confirmar-turno').then((m)=> m.ConfirmarTurnoComponent),
  },
  {
    path: 'lista-turnos',
    loadComponent: () => import('./lista-turnos/lista-turnos').then((m)=> m.ListaTurnosComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
