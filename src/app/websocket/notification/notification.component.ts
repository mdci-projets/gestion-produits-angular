import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule}from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';

interface NotificationMessage {
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-notification',
  imports: [
    CommonModule,
    ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);

  messages: NotificationMessage[] = [];
  private notificationSubscription!: Subscription;

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notifications$.subscribe(
      (notifications) => {
        this.messages = [...notifications];
        this.scheduleHideMessages();
    });
  }

  private scheduleHideMessages(): void {
      setTimeout(() => {
        if (this.messages.length > 0) {
          this.messages.pop();
        }
      }, 5000);
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }
}
