import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: false,
  template: `
    <div class="welcome-container">
      <h1>¡Bienvenido a tu Dashboard!</h1>
      <p>Aquí podrás gestionar toda la información de tus mascotas</p>
      <div class="features">
        <div class="feature">
          <h3>Mascotas</h3>
          <p>Gestiona la información de tus mascotas</p>
        </div>
        <div class="feature">
          <h3>Eventos</h3>
          <p>Organiza y gestiona eventos para tus mascotas</p>
        </div>
        <div class="feature">
          <h3>Salud</h3>
          <p>Lleva un registro de la salud de tus mascotas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 2rem;
      text-align: center;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .feature {
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .feature h3 {
      color: #4CAF50;
      margin-bottom: 1rem;
    }
  `]
})
export class WelcomeComponent { }
