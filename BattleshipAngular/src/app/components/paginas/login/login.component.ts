import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private miService:AuthService,
    private cookie: CookieService, 
    private router: Router) { }

  ngOnInit(): void {

  }

  loginForm = new FormGroup({
    email : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });

  get f(): { [key: string]: AbstractControl} {return this.loginForm.controls; }

  login(){
    if (this.loginForm.valid){
      const miRequest = {
        'email':this.f['email'].value, 
        'password':this.f['password'].value 
      }
      console.log(miRequest);

      this.miService.login(miRequest).subscribe({
        next: (r) => [
        console.log("Respuesta: " + r),
        this.cookie.set("Token", r.token.token),
        this.router.navigate(['/partidas'])
      ],
        error: (e) => [console.error(e)],
        complete: () => [console.info('complete')]
    })
    }
  }


}
