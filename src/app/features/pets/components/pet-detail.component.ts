import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
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
    // Fetch pet data from the new endpoint
    this.http.get(`/api/pets/detalle/${this.selectedPetId}`).subscribe({
      next: (data: any) => {
        this.pet = data;
        console.log('Pet detail loaded', data);
      },
      error: (err) => {
        this.pet = null;
        console.error('Error loading pet detail', err);
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
    if (edad <= 0) return 'Menos de 1 año';
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
    // Pre-fill form with row data
    if (tipo === 'vacunas') {
      this.addForm = this.fb.group({
        nombre: [row.nombre, Validators.required],
        fecha: [row.fecha ? row.fecha.substring(0, 10) : '', Validators.required],
        proxima_fecha: [row.proxima_fecha ? row.proxima_fecha.substring(0, 10) : '', Validators.required],
        notas: [row.notas || '']
      });
    } else if (tipo === 'desparasitaciones') {
      this.addForm = this.fb.group({
        nombre: [row.nombre, Validators.required],
        fecha: [row.fecha ? row.fecha.substring(0, 10) : '', Validators.required],
        proxima_fecha: [row.proxima_fecha ? row.proxima_fecha.substring(0, 10) : '', Validators.required],
        notas: [row.notas || '']
      });
    } else if (tipo === 'medicaciones') {
      this.addForm = this.fb.group({
        nombre: [row.nombre, Validators.required],
        dosis: [row.dosis, Validators.required],
        frecuencia: [row.frecuencia, Validators.required],
        fecha_inicio: [row.fecha_inicio ? row.fecha_inicio.substring(0, 10) : '', Validators.required],
        fecha_fin: [row.fecha_fin ? row.fecha_fin.substring(0, 10) : ''],
        notas: [row.notas || '']
      });
    } else if (tipo === 'historial') {
      this.addForm = this.fb.group({
        fecha: [row.fecha ? row.fecha.substring(0, 10) : '', Validators.required],
        motivo: [row.motivo, Validators.required],
        diagnostico: [row.diagnostico, Validators.required],
        tratamiento: [row.tratamiento || ''],
        proxima_visita: [row.proxima_visita ? row.proxima_visita.substring(0, 10) : '']
      });
    } else if (tipo === 'notas') {
      this.addForm = this.fb.group({
        contenido: [row.contenido, Validators.required],
        fecha: [row.fecha ? row.fecha.substring(0, 10) : '', Validators.required]
      });
    }
    this.addDialogVisible = true;
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
    this.http.put(url, data).subscribe(() => {
      this.addDialogVisible = false;
      this.editMode = false;
      this.editingId = null;
      this.loadAllData();
    });
  }

  deleteRegistro(tipo: string, row: any) {
    if (!confirm('¿Seguro que quieres eliminar este registro?')) return;
    let url = '';
    if (tipo === 'vacunas') url = `/api/vacunas/${row.id}`;
    if (tipo === 'desparasitaciones') url = `/api/desparasitaciones/${row.id}`;
    if (tipo === 'medicaciones') url = `/api/medicaciones/${row.id}`;
    if (tipo === 'historial') url = `/api/historial/${row.id}`;
    if (tipo === 'notas') url = `/api/notas/${row.id}`;
    this.http.delete(url).subscribe(() => {
      this.loadAllData();
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
    if (!this.addForm.valid) return;
    const data = { ...this.addForm.value, mascota_id: this.selectedPetId };
    let url = '';
    if (this.addType === 'vacunas') url = '/api/vacunas';
    if (this.addType === 'desparasitaciones') url = '/api/desparasitaciones';
    if (this.addType === 'medicaciones') url = '/api/medicaciones';
    if (this.addType === 'historial') url = '/api/historial';
    if (this.addType === 'notas') url = '/api/notas';
    this.http.post(url, data).subscribe(() => {
      this.addDialogVisible = false;
      this.loadAllData();
    });
  }

  addRegistroDirect(tab: 'desparasitaciones' | 'medicaciones' | 'vacunas' | 'vet' | 'notas') {
    if (tab === 'desparasitaciones') {
      const data = { ...this.newRow.desparasitaciones, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.fecha || !data.proxima_fecha) return;
      this.http.post('/api/desparasitaciones', data).subscribe(() => {
        this.showAddRow.desparasitaciones = false;
        this.newRow.desparasitaciones = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
        this.loadAllData();
      });
    } else if (tab === 'medicaciones') {
      const data = { ...this.newRow.medicaciones, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.dosis || !data.frecuencia || !data.fecha_inicio) return;
      this.http.post('/api/medicaciones', data).subscribe(() => {
        this.showAddRow.medicaciones = false;
        this.newRow.medicaciones = { nombre: '', dosis: '', frecuencia: '', fecha_inicio: '', fecha_fin: '', notas: '' };
        this.loadAllData();
      });
    } else if (tab === 'vacunas') {
      const data = { ...this.newRow.vacunas, mascota_id: this.selectedPetId };
      if (!data.nombre || !data.fecha || !data.proxima_fecha) return;
      this.http.post('/api/vacunas', data).subscribe(() => {
        this.showAddRow.vacunas = false;
        this.newRow.vacunas = { nombre: '', fecha: '', proxima_fecha: '', notas: '' };
        this.loadAllData();
      });
    } else if (tab === 'vet') {
      const data = { ...this.newRow.vet, mascota_id: this.selectedPetId };
      if (!data.fecha || !data.motivo || !data.diagnostico) return;
      this.http.post('/api/historial', data).subscribe(() => {
        this.showAddRow.vet = false;
        this.newRow.vet = { fecha: '', motivo: '', diagnostico: '', tratamiento: '', proxima_visita: '' };
        this.loadAllData();
      });
    } else if (tab === 'notas') {
      const data = { ...this.newRow.notas, mascota_id: this.selectedPetId };
      if (!data.contenido || !data.fecha) return;
      this.http.post('/api/notas', data).subscribe(() => {
        this.showAddRow.notas = false;
        this.newRow.notas = { contenido: '', fecha: '' };
        this.loadAllData();
      });
    }
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
}
