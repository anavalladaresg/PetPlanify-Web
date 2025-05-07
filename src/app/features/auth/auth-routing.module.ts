import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PublicGuard } from '../../core/guards/public.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [PublicGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { } 