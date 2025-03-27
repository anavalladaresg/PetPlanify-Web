import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { RouterModule, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    FluidModule,
    RouterModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    nombre: '',
    email: '',
    fechaNacimiento: null as Date | null,
    password: '',
    confirmPassword: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  async onSubmit() {
    try {
      // Validar campos vacíos
      if (!this.formData.nombre.trim()) {
        this.mostrarError('El nombre es obligatorio');
        return;
      }

      if (!this.formData.email.trim()) {
        this.mostrarError('El email es obligatorio');
        return;
      }

      if (!this.formData.fechaNacimiento) {
        this.mostrarError('La fecha de nacimiento es obligatoria');
        return;
      }

      if (!this.formData.password) {
        this.mostrarError('La contraseña es obligatoria');
        return;
      }

      if (!this.formData.confirmPassword) {
        this.mostrarError('Debe confirmar la contraseña');
        return;
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.mostrarError('Las contraseñas no coinciden');
        return;
      }

      this.loading = true;

      await this.authService.registerUser({
        nombre: this.formData.nombre.trim(),
        email: this.formData.email.trim(),
        fechaNacimiento: this.formData.fechaNacimiento,
        password: this.formData.password
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: '¡Registro completado con éxito!'
      });

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);

      this.router.navigate(['/welcome']);

    } catch (error: any) {
      console.error('Error en el registro:', error);
      this.mostrarError(error.message || 'Error durante el registro');
    } finally {
      this.loading = false;
    }
  }

  async signInWithSocialProvider(provider: 'google' | 'facebook' | 'github') {
    try {
      this.loading = true;
      let result;

      switch (provider) {
        case 'google':
          result = await this.authService.signInWithGoogle();
          break;
        case 'facebook':
          result = await this.authService.signInWithFacebook();
          break;
        case 'github':
          result = await this.authService.signInWithGithub();
          break;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: '¡Inicio de sesión exitoso!'
      });

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);

    } catch (error: any) {
      console.error('Error en autenticación social:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al intentar iniciar sesión'
      });
    } finally {
      this.loading = false;
    }
  }

  private mostrarError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }
}
