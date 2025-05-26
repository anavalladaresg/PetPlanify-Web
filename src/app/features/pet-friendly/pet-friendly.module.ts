import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PetFriendlyMapComponent } from './pet-friendly-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    PetFriendlyMapComponent
  ],
})
export class PetFriendlyModule { }
