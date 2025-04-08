import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Dashboard</h2>
            <button class="btn btn-danger" (click)="logout()">Cerrar Sesión</button>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3>Bienvenido, {{ user?.name }}</h3>
              <p>Email: {{ user?.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 