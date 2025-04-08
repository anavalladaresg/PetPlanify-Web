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
  currentView: string = 'welcome';

  constructor() {
    console.log('WelcomeComponent cargado');
  }

  navigateTo(view: string) {
    this.currentView = view;
  }
}
