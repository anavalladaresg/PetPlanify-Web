import { Component } from '@angular/core';
import { HomeMenuComponent } from './components/home-menu/home-menu.component';
import { HomeCardsComponent } from './components/home-cards/home-cards.component';
import { HomeImageCompareComponent } from './components/home-image-compare/home-image-compare.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeMenuComponent, HomeCardsComponent, HomeImageCompareComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
