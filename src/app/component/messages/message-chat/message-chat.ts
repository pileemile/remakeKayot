import {Component, Input, OnInit, ViewChild, ElementRef, AfterViewChecked} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Message} from '../../../models/message/message';
import {format, isToday, isYesterday} from 'date-fns';
import {fr} from 'date-fns/locale';
import {MessageService} from '../../../service/message/message-service';

@Component({
  selector: 'app-message-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-chat.html',
  styleUrl: './message-chat.css'
})
export class MessageChat implements OnInit, AfterViewChecked {
  @Input() userId: string = '';
  @Input() otherUserId: string = '';
  @Input() otherUserName: string = 'Utilisateur';

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  public messages: Message[] = [];
  public newMessageContent: string = '';
  public isSending: boolean = false;
  private shouldScrollToBottom: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.messages$.subscribe(messages => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
    });
  }

  ngOnChanges() {
    if (this.userId && this.otherUserId) {
      this.loadMessages();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  async loadMessages() {
    await this.messageService.loadMessages(this.userId, this.otherUserId);
  }

  async sendMessage() {
    if (!this.newMessageContent.trim() || !this.userId || !this.otherUserId) return;

    this.isSending = true;
    try {
      await this.messageService.sendMessage(this.otherUserId, this.newMessageContent);
      this.newMessageContent = '';
    } finally {
      this.isSending = false;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMyMessage(message: Message): boolean {
    return message.sender_id === this.userId;
  }

  formatTime(dateStr: string): string {
    return format(new Date(dateStr), 'HH:mm');
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    }
    return format(date, 'd MMMM yyyy', { locale: fr });
  }

  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;

    const currentMessageDate = new Date(this.messages[index].sent_at).setHours(0,0,0,0);
    const previousMessageDate = new Date(this.messages[index - 1].sent_at).setHours(0,0,0,0);

    return currentMessageDate !== previousMessageDate;
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
