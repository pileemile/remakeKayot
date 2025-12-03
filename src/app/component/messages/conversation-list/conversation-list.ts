import {Component, EventEmitter, Output} from '@angular/core';
import {MessageService} from '../../../service/message/message-service';
import {Subject} from 'rxjs';
import {Conversation} from '../../../models/message/message';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-conversation-list',
  imports: [],
  templateUrl: './conversation-list.html',
  styleUrl: './conversation-list.css',
})
export class ConversationList {
  @Output() conversationSelected = new EventEmitter<string>();

  public conversations: Conversation[] = [];
  public unreadCount = 0;
  public selectedConversationId: string | null = null;

  private destroy$ = new Subject<void>();
  private readonly currentUserId = '22ce5a89-1db2-46e7-a265-c929697ff1d0';

  constructor(public messageService: MessageService) {}

  async ngOnInit() {
    await this.messageService.initializeRealtime(this.currentUserId);

    await this.messageService.loadConversations(this.currentUserId);

    this.messageService.conversations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.conversations = conversations;
      });

    this.messageService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  selectConversation(userId: string): void {
    this.selectedConversationId = userId;
    this.conversationSelected.emit(userId);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;

    return date.toLocaleDateString('fr-FR');
  }

  ngOnDestroy(): void {
    this. destroy$.next();
    this. destroy$.complete();
  }
}
