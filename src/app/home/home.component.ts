import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { ImageCompareModule} from 'primeng/imagecompare';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ImageCompareModule]
})
export class HomeComponent implements AfterViewInit {

  handlePosition: number = 50;

  hoveredSide: 'left' | 'right' | null = null;
  selectedSide: 'left' | 'right' | null = null;

  selectImage(side: 'left' | 'right') {
    this.selectedSide = side;

    setTimeout(() => {
      if (side === 'left') {
        window.open('https://ejemplo.com/perro', '_blank');
      } else {
        window.open('https://ejemplo.com/gato', '_blank');
      }
    }, 1000); // Espera 1s antes de abrir la nueva ventana
  }

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
  
    onSlideEnd(event: any) {
      const position = event.value;
      if (position === 0) {
        window.open('https://ejemplo.com/perro', '_blank');
      } else if (position === 100) {
        window.open('https://ejemplo.com/gato', '_blank');
      }
    }
  
}