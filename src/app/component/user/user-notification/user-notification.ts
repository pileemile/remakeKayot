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
  public unreadCount = 0;
  public isOpen = false;

  private readonly subscriptions: Subscription[] = [];

//TODO Dégeulasse de faire ça
  user_id = "22ce5a89-1db2-46e7-a265-c929697ff1d0";

  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.notificationService.getNotifications(this.user_id);
    console.log(this.notificationLoad);
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

  public getTimeAgo(date: Date | string | number): string {
    const parsedDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));

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

  public get notificationLoad(){
    return this.notificationService.notifications$.value;
  }

  public get notificationNotRead(){
    const notifications = this.notificationLoad
    return notifications?.filter(n => !n.is_read);
  }

  public async isRead(id: string) {
    await this.notificationService.updateNotification(id);
  }
}
