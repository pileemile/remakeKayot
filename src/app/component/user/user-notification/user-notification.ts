import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {NotificationService} from '../../../service/notification/notification-service';
import {Notification} from '../../../models/notification/notification';

@Component({
  selector: 'app-user-notification',
  imports: [CommonModule],
  templateUrl: './user-notification.html',
  styleUrl: './user-notification.css'
})
export class UserNotification implements OnInit, OnDestroy {
  public notifications: Notification[] = [];
  public unreadCount = 0;
  public isOpen = false;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );

    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  public async deleteNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    await this.notificationService.deleteNotification(notification.id);
  }

 public trackByNotificationId(index: number, notification: Notification): string {
    if (!notification.id) {
      return "";
    }
    return notification.id;
  }

  public getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}sem`;
  }

  public getNotificationIcon(type: string): string {
    switch (type) {
      case 'quiz_completed': return 'bien jouer';
      case 'quiz_passed': return 'Passer';
      case 'quiz_failed': return 'Tu as fail le quiz';
      case 'achievement': return 'Achivement';
      default: return 'par défaul';
    }
  }
}
