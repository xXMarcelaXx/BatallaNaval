import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SesionesService } from 'src/app/services/sesiones.service';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.css']
})
export class SesionesComponent implements OnInit {

  constructor(
    private router: Router,
    private miService:SesionesService,
    private cookie: CookieService
  ) { }

  ListaSesiones: any[] = [];


  ngOnInit(): void {
    this.cargarInfo()
  }

  seleccionarSesion(id: string){
    this.cookie.set("TipoJugador", "invitado")
    this.cookie.set("partidaID", id)
    this.router.navigate(['/juego'])
  }

  crearPartida(){
    this.cookie.set("TipoJugador", "host")
    this.router.navigate(['/juego'])
  }

  cargarInfo(){
    
    this.miService.index().subscribe({
      next: (r) => [
      console.log(r),
      this.ListaSesiones = r.data
    ],
      error: (e) => [console.error(e)],
      complete: () => console.info('complete') 
    })
    
  }
}
