import { Component, OnInit } from '@angular/core';
import { PetsService } from '../../../pets/services/pets.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  currentView: string = 'welcome';
  pets: any[] = [];

  constructor(private petsService: PetsService) {}

  ngOnInit() {
    if (this.currentView === 'pets') {
      this.loadPets();
    }
  }

  navigateTo(view: string) {
    this.currentView = view;
    if (view === 'register-pet') {
      // Additional logic if needed for navigation
      console.log('Navigating to register-pet view');
    }
  }

  logout() {
    console.log('User logged out');
  }

  openRegisterPetForm() {
    this.currentView = 'register-pet';
  }

  loadPets() {
    this.petsService.getPets().subscribe(
      (data) => {
        this.pets = data;
      },
      (error) => {
        console.error('Error fetching pets:', error);
      }
    );
  }
}
