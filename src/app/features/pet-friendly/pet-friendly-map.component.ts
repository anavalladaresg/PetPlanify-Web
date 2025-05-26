import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-pet-friendly-map',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './pet-friendly-map.component.html',
  styleUrls: ['./pet-friendly-map.component.css']
})
export class PetFriendlyMapComponent {
  address: string = '';
  // Coordenadas por defecto (ejemplo: CDMX)
  center = { lat: 19.4326, lng: -99.1332 };
  zoom = 13;
  markers: any[] = [];

  buscarDireccion() {
    // Aquí se implementará la llamada a la API de geocoding y la actualización de marcadores
  }
}
