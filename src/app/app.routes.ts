import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { WelcomeComponent } from './features/home/pages/welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [PublicGuard]
  },
  { 
    path: 'registro', 
    component: RegisterComponent,
    canActivate: [PublicGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  { 
    path: 'welcome', 
    component: WelcomeComponent,
    canActivate: [AuthGuard]
  }
];