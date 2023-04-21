import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SesionesService } from 'src/app/services/sesiones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css']
})
export class TableroComponent implements OnInit {

  //Valores default
  columnas: string [] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  filas: string [] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  tableroJ1: any = [];
  tableroJ2: any = [];

  cantidadBarcos: number = 3;

  miInterval: any;

  //Valores de Api (Valores temporales)

  nomJugador: string = ""; //Nombre del usuario que inició sesión
  nomEnemigo: string = "Esperando contrincante..."; //Nombre del usuario que se unió a la partida
  idSesion: string = ""; //ID de la partida

  isHost: boolean = false; //Si el host es el usuario de esta pantalla, generará en automático las primeras tablas y tendrá el primer turno

  respuesta: any = [];


  //Valores cambiantes durante partida
  nomTurno: string = ""; //Nombre del host
  ganador: string = "pendiente"; // Nombre del ganador al destruir todos los barcos enemigos

  empezado:boolean = false;

  estado:string = ""

  constructor(
    private cookie: CookieService,
    private miService:SesionesService
  ) { }

  ngOnInit(): void {

    var TipoJugador = this.cookie.get("TipoJugador")

    if (TipoJugador == 'host'){
      this.isHost = true
      this.nomTurno = this.cookie.get("username")
      this.nomJugador = this.nomTurno
    }


    if (this.isHost){
      this.setTableros()
      this.generarBarcos()
      this.crearPartida()
    } else{
      this.unirsePartida()
    }


    this.miInterval = setInterval(() => {
      this.cargarInfo()
    }, 5000); 
  }

  ngOnDestroy() {
    if (this.miInterval) {
      clearInterval(this.miInterval);
    }
  }


  //
  //
  //
  // ------- | EJECUTAR SÓLO UNA VEZ (HOST) | -------
  //
  //
  //

  setTableros(){
    this.columnas.forEach(C => {
      this.filas.forEach(F => {

        //Estado = 1 --> Agua
        //Estado = 2 --> Barco
        //Estado = 3 --> Disparo Barco
        //Estado = 4 --> Disparo agua
        var aux = {
          "Nombre": C + F,
          "Estado": 1
        }
        var aux2 = {
          "Nombre": C + F,
          "Estado": 1
        }
        this.tableroJ1.push(aux)
        this.tableroJ2.push(aux2)
      });
    });
  }

  generarBarcos(){
    var i,j,k;
    var aux = [] //Lista de indices del Tablero 1
    var aux2 = [] //Lista de indices del Tablero 2

    //Llenar lista de indices
    for (i = this.tableroJ1.length-1; i >= 0; i--){
      aux.push(i)
      aux2.push(i)
    }
    
    //Desordenar índices Tablero 1
    for (i = aux.length; i; i--) {
        j = Math.floor(Math.random() * i);
        k = aux[i - 1];
        aux[i - 1] = aux[j];
        aux[j] = k;
    }

    //Desordenar índices Tablero 2
    for (i = aux2.length; i; i--) {
      j = Math.floor(Math.random() * i);
      k = aux2[i - 1];
      aux2[i - 1] = aux2[j];
      aux2[j] = k;
    }

    //Agregar barcos a tablero 1
    for (i = 0; i < this.cantidadBarcos; i++){
      var indice = aux[i]
      this.tableroJ1[indice].Estado = 2;
    }

    //Agregar barcos a tablero 2
    for (i = 0; i < this.cantidadBarcos; i++){
      var indice = aux2[i]
      this.tableroJ2[indice].Estado = 2;
    }
  }

  crearPartida(){
    const miRequest ={
      "host": this.cookie.get("username"),
      "invitado": "pendiente",
      "tablero_host": this.tableroJ1,
      "tablero_invitado": this.tableroJ2,
      "ganador": "pendiente",
      "estado": "espera",
      "turno": this.cookie.get("username")
    }

    this.miService.crearpartida(miRequest).subscribe({
      next: (r) => [
      console.log(r.data),
      this.idSesion = r.data.insertedId
    ],
      error: (e) => [console.error(e)],
      complete: () => console.info('complete') 
    })


  }


  //
  //
  //
  // ------- | EJECUTAR DURANTE PARTIDA | -------
  //
  //
  //
  atacarEnemigo(casillaInd:number){
    //ATACAR
      //Si el ataque es a agua, cambia a 4, y si es barco, cambia a 3
    if (this.nomTurno == this.nomJugador){
      if (this.tableroJ2[casillaInd].Estado == 1){
        this.tableroJ2[casillaInd].Estado = 4
      }else if (this.tableroJ2[casillaInd].Estado == 2){
        this.tableroJ2[casillaInd].Estado = 3
      }
    }

    //CAMBIAR TURNO
    this.nomTurno = this.nomEnemigo;

    //Verificar si el jugador ganó
    this.verificarVictoria()

    //Actualizar
    this.enviarTiro()

  }

  enviarTiro(){
    if (this.isHost){
      this.respuesta.tablero_invitado = this.tableroJ2;
    }else{
      this.respuesta.tablero_host = this.tableroJ2;
    }
    this.actualizarInfo()
  }

  verificarVictoria(){
    var aux = 0;
    this.tableroJ2.forEach((casilla: { Estado: number; }) => {
      if (casilla.Estado == 3)
        aux++;
    });

    if (aux == this.cantidadBarcos){
      const miRequest ={
        "ganador": this.nomJugador,
        "estado": "terminada"
      }

      this.miService.ganador(miRequest, this.idSesion).subscribe({
        next: (r) => [
        console.log(r)
      ],
        error: (e) => [console.error(e)],
        complete: () => console.info('complete') 
      })

      alert("Fin del juego")
    }
  }

  //
  //
  //
  // ------- | INTERVALO | -------
  //
  //
  //

  cargarInfo(){
    console.log("CARGANDO INFO")
    this.miService.show(this.idSesion).subscribe({
      next: (r) => [
      console.log(r.data),
      this.respuesta = r.data,
      this.cargarTabla()
    ],
      error: (e) => [console.error(e)],
      complete: () => console.info('complete') 
    })
  }

  cargarTabla(){
    if (this.isHost){
      this.tableroJ1 = this.respuesta.tablero_host;
      this.tableroJ2 = this.respuesta.tablero_invitado;
    }else{
      this.tableroJ2 = this.respuesta.tablero_host;
      this.tableroJ1 = this.respuesta.tablero_invitado;
    }

    if (this.isHost){
      this.nomJugador = this.respuesta.host;
      this.nomEnemigo = this.respuesta.invitado;
    }else{
      this.nomJugador = this.respuesta.invitado;
      this.nomEnemigo = this.respuesta.host;
    }
    this.nomTurno = this.respuesta.turno;
    this.estado = this.respuesta.estado;
    this.ganador = this.respuesta.ganador;

    if (!this.empezado && !this.isHost){
      this.setInvitado()
      this.empezado = true
    }
  }

  setInvitado(){
    console.log("BBBBBBBBBBBBBBBBBBB")
    const miRequest ={
      "invitado": this.cookie.get("username")
    }

    this.miService.setInvitado(miRequest, this.idSesion).subscribe({
      next: (r) => [
      console.log(r)
    ],
      error: (e) => [console.error(e)],
      complete: () => console.info('complete') 
    })
  }


  //
  //
  //
  // ------- | INVITADO | -------
  //
  //
  //

  unirsePartida(){
    console.log("SE UNIÓ ALGUIEN")
    this.idSesion = this.cookie.get("partidaID")
    this.cargarInfo()
  }

  //
  //
  //
  // ------- | EVENTOS | -------
  //
  //
  //

  actualizarInfo(){

    if (this.isHost){
      var host = this.cookie.get("username");
      var invitado = this.nomEnemigo;
      var T1 = this.tableroJ1;
      var T2 = this.tableroJ2;
    }else{
      var host = this.nomEnemigo;
      var invitado = this.cookie.get("username");
      var T2 = this.tableroJ1;
      var T1 = this.tableroJ2;
    }

    const miRequest ={
      "host": host,
      "invitado": invitado,
      "tablero_host": T1,
      "tablero_invitado": T2,
      "ganador": "pendiente",
      "estado": "espera",
      "turno": this.nomTurno
    }

    console.log("ACTUALIZANDO")
    this.miService.updateList(miRequest, this.idSesion).subscribe({
      next: (r) => [
      console.log(r)
    ],
      error: (e) => [console.error(e)],
      complete: () => console.info('complete') 
    })
  }
  

}
