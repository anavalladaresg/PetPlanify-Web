import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { ImageCompareComponent } from '../components/image-compare/image-compare.component';
import { CardComponent } from '../components/card/card.component';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ImageCompareComponent, CardComponent, MenuComponent]
})
export class HomeComponent implements AfterViewInit {

  handlePosition: number = 50;

  hoveredSide: 'left' | 'right' | null = null;
  selectedSide: 'left' | 'right' | null = null;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 300); // Retraso progresivo para cada tarjeta

          // 🔹 Deja de observar esta tarjeta después de animarla
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Selecciona todas las tarjetas
    const tarjetas: NodeListOf<Element> = this.el.nativeElement.querySelectorAll('.tarjeta-inner');
    tarjetas.forEach(tarjeta => observer.observe(tarjeta));
  }
}