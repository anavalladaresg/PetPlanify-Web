import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from './event.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/events');
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>('/api/events', event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`/api/events/${id}`);
  }
}
