import { Component } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [MegaMenuModule, ButtonModule],
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.css']
})
export class HomeMenuComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToBreeds() {
    this.router.navigate(['/breeds']);
  }

  navigateToGuides() {
    this.router.navigate(['/guides']);
  }
}
