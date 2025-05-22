import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { LoginComponent } from '../features/auth/components/login/login.component';
import { RegisterComponent } from '../features/auth/components/register/register.component';
import { DashboardComponent } from '../features/dashboard/components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'register-pet', loadChildren: () => import('../features/pets/pets.module').then(m => m.PetsModule) }
];
