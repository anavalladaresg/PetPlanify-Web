import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})
export class DashboardComponent {
  currentView: string = 'welcome';
  pets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPets();
  }

  navigateTo(view: string) {
    this.currentView = view;
  }

  logout() {
    // Aquí puedes implementar la lógica de cierre de sesión
  }

  showAddPetForm = false;
  newPet: any = {
    nombre: '',
    tipo: '',
    raza: '',
    fechaNacimiento: '',
    peso: '',
    foto: null
  };
  razasDisponibles: string[] = [];

  private razasPerro: string[] = [
    'Labrador Retriever', 'Bulldog', 'Poodle', 'Chihuahua', 'Pastor Alemán', 'Golden Retriever', 'Beagle', 'Boxer', 'Dachshund', 'Rottweiler'
  ];
  private razasGato: string[] = [
    'Persa', 'Siamés', 'Maine Coon', 'Bengala', 'Azul Ruso', 'Sphynx', 'British Shorthair', 'Ragdoll', 'Abisinio', 'Scottish Fold'
  ];

  onTipoChange() {
    if (this.newPet.tipo === 'perro') {
      this.razasDisponibles = this.razasPerro;
      this.newPet.raza = '';
    } else if (this.newPet.tipo === 'gato') {
      this.razasDisponibles = this.razasGato;
      this.newPet.raza = '';
    } else {
      this.razasDisponibles = [];
      this.newPet.raza = '';
    }
  }

  onFotoChange(event: any) {
    const file = event.target.files[0];
    this.newPet.foto = file;
  }

  // Utilidad para obtener el usuario solo en navegador
  getUserFromStorage(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return {};
  }

  loadPets() {
    const user = this.getUserFromStorage();
    if (!user.id) return;
    this.http.get<any[]>(`/api/pets/${user.id}`).subscribe({
      next: (pets) => this.pets = pets,
      error: () => this.pets = []
    });
  }

  addPet() {
    const user = this.getUserFromStorage();
    if (!user.id) {
      alert('No hay usuario logueado.');
      return;
    }
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('nombre', this.newPet.nombre);
    formData.append('tipo', this.newPet.tipo);
    formData.append('raza', this.newPet.raza);
    formData.append('fechaNacimiento', this.newPet.fechaNacimiento);
    formData.append('peso', this.newPet.peso);
    if (this.newPet.foto) {
      formData.append('foto', this.newPet.foto);
    }
    this.http.post('/api/pets', formData).subscribe({
      next: (res) => {
        this.showAddPetForm = false;
        this.newPet = {
          nombre: '',
          tipo: '',
          raza: '',
          fechaNacimiento: '',
          peso: '',
          foto: null
        };
        this.razasDisponibles = [];
        this.loadPets(); // Recargar mascotas
      },
      error: (err) => {
        alert('Error al guardar la mascota: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }

  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad === 1 ? '1 año' : `${edad} años`;
  }
}
