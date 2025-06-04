import { Component, Output, EventEmitter, Input, OnChanges, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css']
})
export class PetDetailComponent implements OnChanges {
  vacunas: any[] = [];
  desparasitaciones: any[] = [];
  medicaciones: any[] = [];
  historial: any[] = [];
  notas: any[] = [];

  pet: any = null; // Holds current pet data
  activeTab: string = 'overview'; // For tab navigation

  @Input() selectedPetId: string = '';

  addDialogVisible = false;
  addForm!: FormGroup;
  addType: string = '';

  editMode = false;
  editingId: number | null = null;

  activeTabIndex: number = 0;
  tabAnimationClass: string = '';
  private lastTabIndex: number = 0;
  tabOrder: string[] = ['overview', 'vet', 'vacunas', 'desparasitaciones', 'medicaciones', 'notas'];

  @Output() close = new EventEmitter<void>();

  showAddRow = {
    desparasitaciones: false,
    medicaciones: false,
    vacunas: false,
    vet: false,
    notas: false
  };
  newRow = {
    desparasitaciones: { nombre: '', fecha: '', proxima_fecha: '', notas: '' },
    medicaciones: { nombre: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' },
    vacunas: { nombre: '', fecha: '', proxima_fecha: '', notas: '' },
    vet: { fecha: '', motivo: '', diagnostico: '', tratamiento: '', proxima_visita: '' },
    notas: { contenido: '', fecha: '' }
  };

  // --- NUEVO: Estados para feedback visual y errores ---
  loadingRow: { [key: string]: boolean } = {};
  rowError: { [key: string]: string } = {};
  rowSuccess: { [key: string]: boolean } = {};

  // --- Agregar propiedades y métodos para edición en línea ---
  editRow: any = {};

  // --- MODAL NUEVA MASCOTA ---
  showAddPetModal = false;
  newPet: any = {
    nombre: '',
    tipo: '',
    raza: '',
    edad: '',
    foto: null,
    notas: ''
  };
  razasDisponibles: string[] = [];
  private razasPerro: string[] = [
    'Labrador Retriever', 'Bulldog', 'Poodle', 'Chihuahua', 'Pastor Alemán', 'Golden Retriever', 'Beagle', 'Boxer', 'Dachshund', 'Rottweiler'
  ];
  private razasGato: string[] = [
    'Persa', 'Siamés', 'Maine Coon', 'Bengala', 'Azul Ruso', 'Sphynx', 'British Shorthair', 'Ragdoll', 'Abisinio', 'Scottish Fold'
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService // <-- INJECT TOAST SERVICE
  ) {
    this.addForm = this.fb.group({}); // Ensure addForm is always a valid FormGroup
    this.route.params.subscribe(params => {
      this.selectedPetId = params['id'];
      this.loadAllData();
    });
  }

  ngOnChanges() {
    if (this.selectedPetId) {
      this.loadAllData();
    }
  }

  loadAllData() {
    if (!this.selectedPetId) return; // Protege contra llamadas con undefined
    // Fetch pet data from the new endpoint
    this.http.get(`/api/pets/detalle/${this.selectedPetId}`).subscribe({
      next: (data: any) => {
        this.pet = data;
        console.log('Pet detail loaded', data);
      },
      error: (err) => {
        this.pet = null;
        console.error('Error loading pet detail', err);
        if (this.toast && this.toast.showError) {
          this.toast.showError('No se pudo cargar el detalle de la mascota.');
        }
      }
    });
    this.http.get(`/api/pets/${this.selectedPetId}/vacunas`).subscribe((data: any) => this.vacunas = data);
    this.http.get(`/api/pets/${this.selectedPetId}/desparasitaciones`).subscribe((data: any) => this.desparasitaciones = data);
    this.http.get(`/api/pets/${this.selectedPetId}/medicaciones`).subscribe((data: any) => this.medicaciones = data);
    this.http.get(`/api/pets/${this.selectedPetId}/visitas_veterinario`).subscribe((data: any) => this.historial = data);
    this.http.get(`/api/pets/${this.selectedPetId}/observaciones`).subscribe((data: any) => this.notas = data);
  }

  calcularEdad(fechaNacimiento: string | undefined): string {
    if (!fechaNacimiento) return '';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    // Si la edad es menor a 1 año, mostrar en meses
    if (edad < 1) {
      let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
      if (hoy.getDate() < nacimiento.getDate()) {
        meses--;
      }
      if (meses <= 0) return 'Menos de 1 mes';
      return meses === 1 ? '1 mes' : `${meses} meses`;
    }
    return edad === 1 ? '1 año' : `${edad} años`;
  }

  editPet() {
    // Implement navigation or modal for editing pet info
    // Example: open a dialog or navigate to edit page
    alert('Edit pet info (feature to implement)');
  }

  openEditDialog(tipo: string, row: any) {
    this.addType = tipo;
    this.editMode = true;
    this.editingId = row.id;
    // Copia los datos de la fila a editar
    this.editRow = { ...row };
  }

  saveEditRow(tipo: string, row: any) {
    if (!this.editingId) return;
    let url = '';
    if (tipo === 'vacunas') url = `/api/vacunas/${this.editingId}`;
    if (tipo === 'desparasitaciones') url = `/api/desparasitaciones/${this.editingId}`;
    if (tipo === 'medicaciones') url = `/api/medicaciones/${this.editingId}`;
    if (tipo === 'historial') url = `/api/historial/${this.editingId}`;
    if (tipo === 'notas') url = `/api/notas/${this.editingId}`;
    const data = { ...this.editRow, mascota_id: this.selectedPetId };
    this.http.put(url, data).subscribe({
      next: () => {
        this.editingId = null;
        this.editMode = false;
        this.editRow = {};
        this.reloadList(tipo === 'historial' ? 'vet' : tipo);
        if (this.toast && this.toast.showSuccess) {
          this.toast.showSuccess('Registro actualizado correctamente');
        }
      },
      error: () => {
        if (this.toast && this.toast.showError) {
          this.toast.showError('Error al actualizar el registro');
        }
      }
    });
  }

  cancelEditRow() {
    this.editingId = null;
    this.editMode = false;
    this.editRow = {};
  }

  private reloadList(tab: string) {
    if (tab === 'vacunas') {
      this.http.get(`/api/pets/${this.selectedPetId}/vacunas`).subscribe((data: any) => this.vacunas = data);
    } else if (tab === 'desparasitaciones') {
      this.http.get(`/api/pets/${this.selectedPetId}/desparasitaciones`).subscribe((data: any) => this.desparasitaciones = data);
    } else if (tab === 'medicaciones') {
      this.http.get(`/api/pets/${this.selectedPetId}/medicaciones`).subscribe((data: any) => this.medicaciones = data);
    } else if (tab === 'vet' || tab === 'historial') {
      this.http.get(`/api/pets/${this.selectedPetId}/visitas_veterinario`).subscribe((data: any) => this.historial = data);
    } else if (tab === 'notas') {
      this.http.get(`/api/pets/${this.selectedPetId}/observaciones`).subscribe((data: any) => this.notas = data);
    }
  }

  updateRegistro() {
    if (!this.addForm.valid || this.editingId == null) return;
    const data = { ...this.addForm.value, mascota_id: this.selectedPetId, id: this.editingId };
    let url = '';
    if (this.addType === 'vacunas') url = `/api/vacunas/${this.editingId}`;
    if (this.addType === 'desparasitaciones') url = `/api/desparasitaciones/${this.editingId}`;
    if (this.addType === 'medicaciones') url = `/api/medicaciones/${this.editingId}`;
    if (this.addType === 'historial') url = `/api/historial/${this.editingId}`;
    if (this.addType === 'notas') url = `/api/notas/${this.editingId}`;
    this.http.put(url, data).subscribe({
      next: () => {
        this.addDialogVisible = false;
        this.editMode = false;
        this.editingId = null;
        this.reloadList(this.addType === 'historial' ? 'vet' : this.addType);
        this.toast.showSuccess('Registro actualizado correctamente');
      },
      error: () => {
        this.toast.showError('Error al actualizar el registro');
      }
    });
  }

  confirmDeleteRegistro(tipo: string, row: any) {
    if (!window.confirm('¿Seguro que quieres eliminar este registro?')) return;
    this.deleteRegistro(tipo, row);
  }

  deleteRegistro(tipo: string, row: any) {
    this.rowError[tipo] = '';
    this.rowSuccess[tipo] = false;
    let url = '';
    if (tipo === 'vacunas') url = `/api/vacunas/${row.id}`;
    if (tipo === 'desparasitaciones') url = `/api/desparasitaciones/${row.id}`;
    if (tipo === 'medicaciones') url = `/api/medicaciones/${row.id}`;
    if (tipo === 'historial') url = `/api/historial/${row.id}`;
    if (tipo === 'notas') url = `/api/notas/${row.id}`;
    this.loadingRow[tipo] = true;
    this.http.delete(url).subscribe({
      next: () => {
        this.rowSuccess[tipo] = true;
        setTimeout(() => this.rowSuccess[tipo] = false, 1800);
        this.loadingRow[tipo] = false;
        this.reloadList(tipo === 'historial' ? 'vet' : tipo);
        if (this.toast && this.toast.showSuccess) {
          this.toast.showSuccess('Registro eliminado correctamente');
        }
      },
      error: () => {
        this.rowError[tipo] = 'Error al eliminar. Intenta de nuevo.';
        this.loadingRow[tipo] = false;
        if (this.toast && this.toast.showError) {
          this.toast.showError('Error al eliminar el registro');
        }
      }
    });
  }

  openAddDialog(tipo: string) {
    this.addType = tipo;
    this.editMode = false;
    this.editingId = null;
    // Definir campos según tipo
    if (tipo === 'vacunas') {
      this.addForm = this.fb.group({
        nombre: ['', Validators.required],
        fecha: ['', Validators.required],
        proxima_fecha: ['', Validators.required],
        notas: ['']
      });
    } else if (tipo === 'desparasitaciones') {
      this.addForm = this.fb.group({
        nombre: ['', Validators.required],
        fecha: ['', Validators.required],
        proxima_fecha: ['', Validators.required],
        notas: ['']
      });
    } else if (tipo === 'medicaciones') {
      this.addForm = this.fb.group({
        nombre: ['', Validators.required],
        dosis: ['', Validators.required],
        frecuencia: ['', Validators.required],
        fecha_inicio: ['', Validators.required],
        fecha_fin: [''],
        notas: ['']
      });
    } else if (tipo === 'historial') {
      this.addForm = this.fb.group({
        fecha: ['', Validators.required],
        motivo: ['', Validators.required],
        diagnostico: ['', Validators.required],
        tratamiento: [''],
        proxima_visita: ['']
      });
    } else if (tipo === 'notas') {
      this.addForm = this.fb.group({
        contenido: ['', Validators.required],
        fecha: ['', Validators.required]
      });
    }
    this.addDialogVisible = true;
  }

  closeAddDialog() {
    this.addDialogVisible = false;
    this.editMode = false;
    this.editingId = null;
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    // Animación o lógica al cambiar de pestaña
  }

  setTab(tab: string) {
    const newIndex = this.tabOrder.indexOf(tab);
    const oldIndex = this.tabOrder.indexOf(this.activeTab);
    if (newIndex > oldIndex) {
      this.tabAnimationClass = 'slide-left-enter';
    } else if (newIndex < oldIndex) {
      this.tabAnimationClass = 'slide-right-enter';
    } else {
      this.tabAnimationClass = '';
    }
    this.activeTab = tab;
    this.lastTabIndex = newIndex;
    // For repeated transitions, remove class after animation
    setTimeout(() => { this.tabAnimationClass = ''; }, 400);
  }

  addRegistro() {
    if (!this.addForm.valid || !this.selectedPetId) return;
    const data = { ...this.addForm.value, mascota_id: this.selectedPetId };
    let url = '';
    if (this.addType === 'vacunas') url = '/api/vacunas';
    if (this.addType === 'desparasitaciones') url = '/api/desparasitaciones';
    if (this.addType === 'medicaciones') url = '/api/medicaciones';
    if (this.addType === 'historial') url = '/api/historial';
    if (this.addType === 'notas') url = '/api/notas';
    this.http.post(url, data).subscribe({
      next: () => {
        this.addDialogVisible = false;
        this.loadAllData();
        this.toast.showSuccess('Registro guardado correctamente');
      },
      error: () => {
        if (this.toast && this.toast.showError) {
          this.toast.showError('Error al guardar el registro');
        }
      }
    });
  }

  addRegistroDirect(tab: 'desparasitaciones' | 'medicaciones' | 'vacunas' | 'vet' | 'notas') {
    this.rowError[tab] = '';
    this.rowSuccess[tab] = false;
    this.loadingRow[tab] = true;
    let data: any;
    if (!this.selectedPetId) {
      this.rowError[tab] = 'No hay mascota seleccionada.';
      this.loadingRow[tab] = false;
      return;
    }
    // Validación manual de campos requeridos
    if (tab === 'desparasitaciones') {
      data = { ...this.newRow.desparasitaciones, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.fecha || !data.proxima_fecha) {
        this.rowError[tab] = 'Completa todos los campos obligatorios.';
        this.loadingRow[tab] = false;
        return;
      }
    } else if (tab === 'medicaciones') {
      data = { ...this.newRow.medicaciones, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.dosis || !data.frecuencia || !data.fecha_inicio) {
        this.rowError[tab] = 'Completa todos los campos obligatorios.';
        this.loadingRow[tab] = false;
        return;
      }
    } else if (tab === 'vacunas') {
      data = { ...this.newRow.vacunas, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.fecha || !data.proxima_fecha) {
        this.rowError[tab] = 'Completa todos los campos obligatorios.';
        this.loadingRow[tab] = false;
        return;
      }
    } else if (tab === 'vet') {
      data = { ...this.newRow.vet, mascota_id: this.selectedPetId };
      if (!data.fecha || !data.motivo || !data.diagnostico) {
        this.rowError[tab] = 'Completa todos los campos obligatorios.';
        this.loadingRow[tab] = false;
        return;
      }
    } else if (tab === 'notas') {
      data = { ...this.newRow.notas, mascota_id: this.selectedPetId };
      if (!data.contenido || !data.fecha) {
        this.rowError[tab] = 'Completa todos los campos obligatorios.';
        this.loadingRow[tab] = false;
        return;
      }
    }
    // --- Llamada API ---
    let url = '';
    if (tab === 'desparasitaciones') url = '/api/desparasitaciones';
    if (tab === 'medicaciones') url = '/api/medicaciones';
    if (tab === 'vacunas') url = '/api/vacunas';
    if (tab === 'vet') url = '/api/historial';
    if (tab === 'notas') url = '/api/notas';
    this.http.post(url, data).subscribe({
      next: () => {
        this.showAddRow[tab] = false;
        // Limpiar campos
        if (tab === 'desparasitaciones') this.newRow.desparasitaciones = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
        if (tab === 'medicaciones') this.newRow.medicaciones = { nombre: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' };
        if (tab === 'vacunas') this.newRow.vacunas = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
        if (tab === 'vet') this.newRow.vet = { fecha: '', motivo: '', diagnostico: '', tratamiento: '', proxima_visita: '' };
        if (tab === 'notas') this.newRow.notas = { contenido: '', fecha: '' };
        this.rowSuccess[tab] = true;
        setTimeout(() => this.rowSuccess[tab] = false, 1800);
        this.loadingRow[tab] = false;
        this.reloadList(tab);
        if (this.toast && this.toast.showSuccess) {
          this.toast.showSuccess('Registro guardado correctamente');
        }
      },
      error: (err) => {
        this.rowError[tab] = 'Error al guardar. Intenta de nuevo.';
        this.loadingRow[tab] = false;
        if (this.toast && this.toast.showError) {
          this.toast.showError('Error al guardar el registro');
        }
      }
    });
  }

  toggleAddRow(tab: 'desparasitaciones' | 'medicaciones' | 'vacunas' | 'vet' | 'notas') {
    this.showAddRow[tab] = !this.showAddRow[tab];
    if (!this.showAddRow[tab]) {
      if (tab === 'desparasitaciones') {
        this.newRow.desparasitaciones = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
      } else if (tab === 'medicaciones') {
        this.newRow.medicaciones = { nombre: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' };
      } else if (tab === 'vacunas') {
        this.newRow.vacunas = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
      } else if (tab === 'vet') {
        this.newRow.vet = { fecha: '', motivo: '', diagnostico: '', tratamiento: '', proxima_visita: '' };
      } else if (tab === 'notas') {
        this.newRow.notas = { contenido: '', fecha: '' };
      }
    }
  }

  goBack() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent) {
    this.goBack();
  }

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

  addPet() {
    // Lógica real para guardar la mascota
    const formData = new FormData();
    formData.append('nombre', this.newPet.nombre);
    formData.append('tipo', this.newPet.tipo);
    formData.append('raza', this.newPet.raza);
    formData.append('edad', this.newPet.edad);
    formData.append('notas', this.newPet.notas);
    if (this.newPet.foto) {
      formData.append('foto', this.newPet.foto);
    }
    // Llamada a la API (ajusta la URL según tu backend)
    this.http.post('/api/pets', formData).subscribe({
      next: (res) => {
        this.showAddPetModal = false;
        this.newPet = { nombre: '', tipo: '', raza: '', edad: '', foto: null, notas: '' };
        this.razasDisponibles = [];
        if (this.toast && this.toast.showSuccess) {
          this.toast.showSuccess('Mascota añadida correctamente');
        }
        // Opcional: recargar datos de mascotas si tienes un método
        // this.loadAllData();
      },
      error: (err) => {
        if (this.toast && this.toast.showError) {
          this.toast.showError('Error al añadir la mascota');
        }
      }
    });
  }
}
