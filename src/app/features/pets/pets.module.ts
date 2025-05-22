import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPetComponent } from './components/register-pet/register-pet.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegisterPetComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RegisterPetComponent]
})
export class PetsModule {}