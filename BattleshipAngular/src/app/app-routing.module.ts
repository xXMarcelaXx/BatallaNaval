import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/paginas/login/login.component';
import { RegistrarseComponent } from './components/paginas/registrarse/registrarse.component';
import { SesionesComponent } from './components/paginas/sesiones/sesiones.component';
import {TableroComponent} from './components/paginas/tablero/tablero.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'registrarse', component: RegistrarseComponent},
  {path: 'login', component: LoginComponent},
  {path: 'juego', component: TableroComponent},
  {path: 'partidas', component: SesionesComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
