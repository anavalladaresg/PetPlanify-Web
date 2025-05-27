import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule
  ],
  providers: [DatePipe, DialogService],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css']
})
export class PetDetailComponent {
  vacunas: any[] = [];
  desparasitaciones: any[] = [];
  medicaciones: any[] = [];
  historial: any[] = [];
  notas: any[] = [];

  selectedPetId: string = '';

  addDialogVisible = false;
  addForm!: FormGroup;
  addType: string = '';

  editMode = false;
  editingId: number | null = null;

  activeTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogService: DialogService
  ) {
    this.route.params.subscribe(params => {
      this.selectedPetId = params['id'];
      this.loadAllData();
    });
  }

  loadAllData() {
    this.http.get(`/api/vacunas/${this.selectedPetId}`).subscribe((data: any) => this.vacunas = data);
    this.http.get(`/api/desparasitaciones/${this.selectedPetId}`).subscribe((data: any) => this.desparasitaciones = data);
    this.http.get(`/api/medicaciones/${this.selectedPetId}`).subscribe((data: any) => this.medicaciones = data);
    this.http.get(`/api/historial/${this.selectedPetId}`).subscribe((data: any) => this.historial = data);
    this.http.get(`/api/notas/${this.selectedPetId}`).subscribe((data: any) => this.notas = data);
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
}
