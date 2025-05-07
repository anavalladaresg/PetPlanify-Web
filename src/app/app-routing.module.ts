import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PublicGuard } from './core/guards/public.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    canActivate: [PublicGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [PublicGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pets',
    loadChildren: () => import('./features/pets/pets.module').then(m => m.PetsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'health',
    loadChildren: () => import('./features/health/health.module').then(m => m.HealthModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pet-friendly',
    loadChildren: () => import('./features/pet-friendly/pet-friendly.module').then(m => m.PetFriendlyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 