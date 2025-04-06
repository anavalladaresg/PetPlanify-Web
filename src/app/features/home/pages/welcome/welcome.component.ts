import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class WelcomeComponent {
  constructor() {
    console.log('WelcomeComponent cargado');
  }
}
