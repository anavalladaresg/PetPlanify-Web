import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from './events.service';
import { Event } from './event.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DialogModule, TableModule, InputTextModule, InputTextareaModule, GoogleMapsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  showDialog = false;
  eventForm!: FormGroup;

  // Mapa y geolocalización
  mapCenter = { lat: 19.4326, lng: -99.1332 };
  mapZoom = 12;
  eventMarkers: any[] = [];

  constructor(private eventsService: EventsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadEvents();
    this.loadEventMarkers();
  }

  loadEvents() {
    this.eventsService.getEvents().subscribe(events => {
      this.events = events;
      this.loadEventMarkers();
    });
  }

  loadEventMarkers() {
    this.eventMarkers = this.events.map(ev => ({
      position: this.getLatLngFromLocation(ev.location),
      label: ev.title
    }));
  }

  getLatLngFromLocation(location: string): { lat: number, lng: number } {
    // Aquí deberías usar una API real de geocoding. Por ahora, devuelve un punto fijo.
    // TODO: Integrar Google Maps Geocoding API para obtener coordenadas reales.
    return { lat: 19.4326, lng: -99.1332 };
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  openDialog() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.showDialog = true;
  }

  saveEvent() {
    if (this.eventForm.valid) {
      this.eventsService.createEvent(this.eventForm.value).subscribe(() => {
        this.showDialog = false;
        this.loadEvents();
      });
    }
  }

  deleteEvent(event: Event) {
    if (event.id && confirm('¿Eliminar este evento?')) {
      this.eventsService.deleteEvent(event.id).subscribe(() => this.loadEvents());
    }
  }
}
