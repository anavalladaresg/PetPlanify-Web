import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

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
