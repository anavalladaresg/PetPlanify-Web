import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent {
  title = 'petplanify_web';
}
