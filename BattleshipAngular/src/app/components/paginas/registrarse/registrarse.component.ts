import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {
  constructor(
    private router: Router,
    private authService:AuthService,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
  }

  miForm = new FormGroup({
    username : new FormControl('', [Validators.required]),
    email : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });

  signup(){    
    if (this.miForm.valid){
      const miRequest = {
        'username':this.f['username'].value, 
        'email':this.f['email'].value, 
        'password':this.f['password'].value 
      }
      console.log(miRequest);
      this.authService.registrarse(miRequest).subscribe({
          next: (r) => [
          console.log(r),
          this.cookie.set("Token", r.token.token),
          this.cookie.set("username", r.username),
          this.router.navigate(['/partidas'])
        ],
          error: (e) => [console.error(e)],
          complete: () => [console.info('complete')]
      })
    }
  }

  get f(): { [key: string]: AbstractControl} {return this.miForm.controls; }
}
