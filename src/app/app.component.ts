import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
  providers: [MessageService]
})
export class AppComponent {
  title = 'PetPlanify';

  constructor(private auth: Auth) {}
}
