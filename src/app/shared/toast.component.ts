import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  message: ToastMessage | null = null;
  private sub!: Subscription;
  private timerSub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toastState$.subscribe(msg => {
      this.message = msg;
      if (this.timerSub) this.timerSub.unsubscribe();
      this.timerSub = timer(2500).subscribe(() => this.message = null);
    });
  }
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.timerSub) this.timerSub.unsubscribe();
  }
}
