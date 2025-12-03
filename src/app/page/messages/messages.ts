import {Component} from '@angular/core';
import {MessageChat} from '../../component/messages/message-chat/message-chat';
import {ConversationList} from '../../component/messages/conversation-list/conversation-list';

@Component({
  selector: 'app-messages',
  imports: [
    MessageChat,
    ConversationList
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  public selectedUserId: string = '22ce5a89-1db2-46e7-a265-c929697ff1d0';
  public selectedUserName: string = '';


  onConversationSelected(data: any) {
    this.selectedUserId = data.userId;
    this.selectedUserName = data.userName;
  }

}
