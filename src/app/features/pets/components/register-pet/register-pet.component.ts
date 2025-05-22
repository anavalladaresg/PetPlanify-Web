import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetsService } from '../../services/pets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-pet',
  templateUrl: './register-pet.component.html',
  styleUrls: ['./register-pet.component.css']
})
export class RegisterPetComponent {
  petForm: FormGroup;
  petTypes = ['Perro', 'Gato'];
  breeds = { Perro: ['Labrador', 'Bulldog', 'Beagle'], Gato: ['Persa', 'Siamés', 'Maine Coon'] };
  selectedBreeds: string[] = [];

  constructor(private fb: FormBuilder, private petsService: PetsService, private router: Router) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      breed: ['', Validators.required],
      birthDate: ['', Validators.required],
      photo: [null, Validators.required]
    });
  }

  onTypeChange(type: string) {
    this.selectedBreeds = this.breeds[type] || [];
    this.petForm.get('breed')?.setValue('');
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formData = new FormData();
      Object.entries(this.petForm.value).forEach(([key, value]) => {
        formData.append(key, value);
      });

      this.petsService.addPet(formData).subscribe(
        () => {
          console.log('Pet added successfully');
          this.router.navigate(['/dashboard']); // Navigate back to dashboard
        },
        (error) => {
          console.error('Error adding pet:', error);
        }
      );
    }
  }

  onCancel() {
    this.petForm.reset();
  }
}