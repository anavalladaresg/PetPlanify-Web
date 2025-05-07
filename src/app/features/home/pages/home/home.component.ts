import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  template: `
    <div class="home-container">
      <h1>Bienvenido a PetPlanify</h1>
      <p>Tu plataforma para gestionar la vida de tus mascotas</p>
      <div class="buttons">
        <button routerLink="/auth/login">Iniciar Sesión</button>
        <button routerLink="/auth/register">Registrarse</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 2rem;
    }
    .buttons {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  `]
})
export class HomeComponent { }