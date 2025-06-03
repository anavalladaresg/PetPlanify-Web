import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(text: string) {
    this.toastSubject.next({ type: 'success', text });
  }
  showError(text: string) {
    this.toastSubject.next({ type: 'error', text });
  }
  showInfo(text: string) {
    this.toastSubject.next({ type: 'info', text });
  }
}
