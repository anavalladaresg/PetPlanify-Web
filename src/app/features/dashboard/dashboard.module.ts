import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component'; 

@NgModule({
  imports: [CommonModule, DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}