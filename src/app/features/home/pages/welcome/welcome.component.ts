import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `<p>welcome works!</p>`
})
export class WelcomeComponent {
  constructor() {
    console.log('WelcomeComponent cargado');
  }
}
