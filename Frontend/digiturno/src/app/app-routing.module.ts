import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TvComponent } from './pages/tv/tv.component';

const routes: Routes = [
  { path: 'tvDigiturno', component: TvComponent },
  { path: '', redirectTo: 'tvDigiturno', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
