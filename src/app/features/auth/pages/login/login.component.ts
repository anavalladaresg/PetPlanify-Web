import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    RouterModule
    ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.formData.email === 'test@example.com') {
      this.errorMessage = 'Este email ya está registrado.';
      return;
    }
    
    console.log('Navegando a /welcome');
    this.router.navigate(['/welcome']).then(success => {
      if (!success) {
        console.error('Error en la navegación');
      }
    });
  }  
}
