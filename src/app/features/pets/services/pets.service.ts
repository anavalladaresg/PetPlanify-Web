import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private apiUrl = 'http://localhost:3000/pets'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  addPet(petData: any): Observable<any> {
    return this.http.post(this.apiUrl, petData);
  }

  getPets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}