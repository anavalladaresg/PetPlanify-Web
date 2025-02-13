import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Agrega la clase cuando es visible
        }
      });
    }, { threshold: 0.2 });

    const tarjetas = this.el.nativeElement.querySelector('.contenedor');
    if (tarjetas) {
      observer.observe(tarjetas);
    }
  }
}
