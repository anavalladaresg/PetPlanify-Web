import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { LoginComponent } from '../features/auth/components/login/login.component';
import { RegisterComponent } from '../features/auth/components/register/register.component';
import { DashboardComponent } from '../features/dashboard/components/dashboard/dashboard.component';
import { AuthGuard } from '../features/auth/services/auth.guard';
import { PetFriendlyMapComponent } from '../features/pet-friendly/pet-friendly-map.component';
import { PetDetailComponent } from '../features/pets/components/pet-detail.component';
import { BreedsComponent } from '../features/breeds/breeds.component';
import { GuidesComponent } from '../features/guides/guides.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'pet-friendly', component: PetFriendlyMapComponent },
  { path: 'pets/:id', component: PetDetailComponent },
  { path: 'breeds', component: BreedsComponent },
  { path: 'guides', component: GuidesComponent },
  // Puedes agregar más rutas aquí
];
