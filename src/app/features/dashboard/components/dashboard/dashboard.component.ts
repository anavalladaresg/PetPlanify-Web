import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentView: string = 'welcome';

  navigateTo(view: string) {
    this.currentView = view;
  }

  logout() {
    // Aquí puedes implementar la lógica de cierre de sesión
  }
}
