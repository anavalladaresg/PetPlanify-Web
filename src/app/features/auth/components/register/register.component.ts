import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    InputTextModule,
    FloatLabelModule,
    ToastModule,
    CalendarModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    nombre: '',
    email: '',
    fechaNacimiento: null,
    password: '',
    confirmPassword: ''
  };
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {}

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.loading = false;
      return;
    }
    this.authService.register({
      nombre: this.formData.nombre,
      email: this.formData.email,
      password: this.formData.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'¡Usuario registrado!'});
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Error al registrar usuario.';
      }
    });
  }

  signInWithSocialProvider(provider: string) {
    // Aquí va la lógica para login social
  }
}
