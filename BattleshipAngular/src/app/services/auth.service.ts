import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enviromet } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(data:any):Observable<any>{
    return this.http.post<any>(`${Enviromet.url}/login`,data);
  }

  registrarse(data:any):Observable<any>{
    return this.http.post<any>(`${Enviromet.url}/register`,data);
  }
}
