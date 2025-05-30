import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PetFriendlyMapComponent } from '../../../pet-friendly/pet-friendly-map.component';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { PetDetailComponent } from '../../../pets/components/pet-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    PetFriendlyMapComponent,
    TabsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmPopupModule,
    PetDetailComponent
  ],
  providers: [ConfirmationService, MessageService]
})
export class DashboardComponent {
  currentView: string = 'welcome';
  pets: any[] = [];
  citas: any[] = [];

  constructor(private http: HttpClient, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) {}

  ngOnInit() {
    this.loadPets();
    this.loadCitas();
  }

  navigateTo(view: string) {
    this.currentView = view;
  }

  logout() {
    // Elimina el usuario del localStorage y redirige al login
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  showAddPetForm = false;
  isEditingPet = false;
  editingPetId: string | null = null;
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
    if (this.newPet.tipo === 'Perro') {
      this.razasDisponibles = this.razasPerro;
      this.newPet.raza = '';
    } else if (this.newPet.tipo === 'Gato') {
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
    if (!user.id) {
      console.warn('No user ID found in localStorage:', user);
      this.pets = [];
      return;
    }
    this.http.get<any[]>(`/api/pets/${user.id}`).subscribe({
      next: (pets) => {
        this.pets = pets;
        console.log('Loaded pets for user', user.id, pets);
      },
      error: (err) => {
        this.pets = [];
        console.error('Error loading pets for user', user.id, err);
      }
    });
  }

  // Cargar citas del usuario desde la API
  loadCitas() {
    const user = this.getUserFromStorage();
    if (!user.id) return;
    this.http.get<any[]>(`/api/citas/${user.id}`).subscribe({
      next: (citas) => this.citas = citas,
      error: () => this.citas = []
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
    if (this.isEditingPet && this.editingPetId) {
      // Editar mascota existente
      this.http.put(`/api/pets/${this.editingPetId}`, formData).subscribe({
        next: (res) => {
          this.showAddPetForm = false;
          this.isEditingPet = false;
          this.editingPetId = null;
          this.newPet = {
            nombre: '',
            tipo: '',
            raza: '',
            fechaNacimiento: '',
            peso: '',
            foto: null
          };
          this.razasDisponibles = [];
          this.loadPets();
        },
        error: (err) => {
          alert('Error al actualizar la mascota: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    } else {
      // Nueva mascota
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
  }

  editPet(pet: any) {
    this.showAddPetForm = true;
    this.isEditingPet = true;
    this.editingPetId = pet.id;
    this.newPet = {
      ...pet,
      fechaNacimiento: pet.fecha_nacimiento, // Ajuste para el campo del formulario
      foto: null // No cargamos la foto original
    };
    this.onTipoChange();
  }

  confirmDeletePet(event: Event, pet: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Seguro que quieres eliminar a ${pet.nombre}?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger'
      },
      accept: () => {
        this.http.delete(`/api/pets/${pet.id}`).subscribe({
          next: () => {
            this.loadPets();
            this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Mascota eliminada', life: 3000 });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la mascota', life: 3000 });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Eliminación cancelada', life: 3000 });
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

  selectedPetId: string = '';
  showPetDetailModal: boolean = false;
  showAddRecordDialog = false;
  activeTab: string = 'vacunas';

  // Datos de ejemplo para las tablas (en la práctica, se cargarán desde la API)
  vacunas: any[] = [];
  desparasitaciones: any[] = [];
  medicaciones: any[] = [];
  observaciones: any[] = [];
  searchGlobal: string = '';

  // Estado temporal para el formulario de registro sanitario
  newRecord: any = {
    nombre: '', dosis: '', frecuencia: '', fecha: '', proxima_fecha: '', fecha_inicio: '', fecha_fin: '', notas: '', contenido: ''
  };

  // Historiales sanitarios por mascota
  vacunasPorMascota: { [petId: string]: any[] } = {};
  desparasitacionesPorMascota: { [petId: string]: any[] } = {};
  medicacionesPorMascota: { [petId: string]: any[] } = {};
  observacionesPorMascota: { [petId: string]: any[] } = {};

  // Devuelve el array de registros para la mascota seleccionada y el tab activo
  get currentRecords() {
    if (!this.selectedPetId) return [];
    if (this.activeTab === 'vacunas') return this.vacunasPorMascota[this.selectedPetId] || [];
    if (this.activeTab === 'desparasitaciones') return this.desparasitacionesPorMascota[this.selectedPetId] || [];
    if (this.activeTab === 'medicaciones') return this.medicacionesPorMascota[this.selectedPetId] || [];
    if (this.activeTab === 'observaciones') return this.observacionesPorMascota[this.selectedPetId] || [];
    return [];
  }

  // Cargar historiales sanitarios de la mascota seleccionada desde el backend
  loadPetHealth(petId: string) {
    this.http.get<any[]>(`/api/pets/${petId}/vacunas`).subscribe({
      next: (data) => this.vacunasPorMascota[petId] = data,
      error: () => this.vacunasPorMascota[petId] = []
    });
    this.http.get<any[]>(`/api/pets/${petId}/desparasitaciones`).subscribe({
      next: (data) => this.desparasitacionesPorMascota[petId] = data,
      error: () => this.desparasitacionesPorMascota[petId] = []
    });
    this.http.get<any[]>(`/api/pets/${petId}/medicaciones`).subscribe({
      next: (data) => this.medicacionesPorMascota[petId] = data,
      error: () => this.medicacionesPorMascota[petId] = []
    });
    this.http.get<any[]>(`/api/pets/${petId}/observaciones`).subscribe({
      next: (data) => this.observacionesPorMascota[petId] = data,
      error: () => this.observacionesPorMascota[petId] = []
    });
  }

  // Al hacer clic en la card de mascota
  togglePetHistory(petId: string) {
    this.selectedPetId = this.selectedPetId === petId ? '' : petId;
    this.activeTab = 'vacunas';
    if (this.selectedPetId) {
      this.loadPetHealth(this.selectedPetId);
    }
  }

  // Abrir modal para añadir registro
  openAddRecordDialog(tab: string) {
    this.activeTab = tab;
    this.showAddRecordDialog = true;
    this.newRecord = { nombre: '', dosis: '', frecuencia: '', fecha: '', proxima_fecha: '', fecha_inicio: '', fecha_fin: '', notas: '', contenido: '' };
  }

  // Cerrar modal
  closeAddRecordDialog() {
    this.showAddRecordDialog = false;
  }

  // Guardar registro sanitario SOLO en la mascota seleccionada
  saveRecord() {
    if (!this.selectedPetId) {
      alert('Selecciona una mascota primero.');
      return;
    }
    let endpoint = '';
    let payload: any = { petId: this.selectedPetId };
    if (this.activeTab === 'vacunas') {
      endpoint = `/api/pets/${this.selectedPetId}/vacunas`;
      payload = {
        ...payload,
        nombre: this.newRecord.nombre,
        fecha: this.newRecord.fecha,
        proxima_fecha: this.newRecord.proxima_fecha,
        notas: this.newRecord.notas
      };
    } else if (this.activeTab === 'desparasitaciones') {
      endpoint = `/api/pets/${this.selectedPetId}/desparasitaciones`;
      payload = {
        ...payload,
        nombre: this.newRecord.nombre,
        fecha: this.newRecord.fecha,
        notas: this.newRecord.notas
      };
    } else if (this.activeTab === 'medicaciones') {
      endpoint = `/api/pets/${this.selectedPetId}/medicaciones`;
      payload = {
        ...payload,
        nombre: this.newRecord.nombre,
        dosis: this.newRecord.dosis,
        frecuencia: this.newRecord.frecuencia,
        fecha_inicio: this.newRecord.fecha_inicio,
        fecha_fin: this.newRecord.fecha_fin,
        notas: this.newRecord.notas
      };
    } else if (this.activeTab === 'observaciones') {
      endpoint = `/api/pets/${this.selectedPetId}/observaciones`;
      payload = {
        ...payload,
        contenido: this.newRecord.contenido,
        fecha: this.newRecord.fecha
      };
    }
    this.http.post(endpoint, payload).subscribe({
      next: (saved) => {
        // Añade el registro solo al array de la mascota seleccionada
        if (this.activeTab === 'vacunas') {
          this.vacunasPorMascota[this.selectedPetId!].push(payload);
        } else if (this.activeTab === 'desparasitaciones') {
          this.desparasitacionesPorMascota[this.selectedPetId!].push(payload);
        } else if (this.activeTab === 'medicaciones') {
          this.medicacionesPorMascota[this.selectedPetId!].push(payload);
        } else if (this.activeTab === 'observaciones') {
          this.observacionesPorMascota[this.selectedPetId!].push(payload);
        }
        this.closeAddRecordDialog();
      },
      error: (err) => {
        alert('Error al guardar el registro sanitario: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }

  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  // Devuelve el left y width para la subrayado animada de los tabs
  getTabUnderlineLeft(): string {
    const tabOrder = ['vacunas', 'desparasitaciones', 'medicaciones', 'observaciones'];
    const idx = tabOrder.indexOf(this.activeTab);
    if (idx === -1) return '0';
    // 25% width por tab, left = idx * 25%
    return `${idx * 25}%`;
  }
  getTabUnderlineWidth(): string {
    return '25%';
  }

  showLogoutDialog = false;
  logoutDialogPosition: 'bottomleft' = 'bottomleft';

  // Cambia el método del botón para mostrar el diálogo
  openLogoutDialog() {
    this.showLogoutDialog = true;
  }
  confirmLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.showLogoutDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Sesión cerrada', detail: 'Has cerrado sesión correctamente', life: 3000 });
  }
  cancelLogout() {
    this.showLogoutDialog = false;
    this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Cierre de sesión cancelado', life: 3000 });
  }

  // Accesos rápidos
  abrirNuevaCita() {
    // Aquí puedes navegar o abrir modal para nueva cita
    this.navigateTo('events');
  }
  abrirRegistrarVacuna() {
    // Aquí puedes navegar o abrir modal para registrar vacuna
    this.navigateTo('health');
  }
  abrirRegistrarMascota() {
    // Aquí puedes navegar o abrir modal para registrar mascota
    this.navigateTo('pets');
  }

  verDetalleMascota(pet: any) {
    // Navega a la ruta de detalle de la mascota
    this.router.navigate(['/pets', pet.id]);
  }

  openPetDetailModal(petId: string) {
    this.selectedPetId = petId || '';
    this.showPetDetailModal = true;
  }

  closePetDetailModal() {
    this.showPetDetailModal = false;
    this.selectedPetId = '';
  }
}
