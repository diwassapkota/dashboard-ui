import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  conversationId: number = 1; // Assuming a single conversation for now

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.chatService.getConversationHistory(this.conversationId).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Failed to load messages', err);
      }
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        conversationId: this.conversationId,
        message: this.newMessage
      };
      this.chatService.sendMessage(message).subscribe({
        next: (sentMessage) => {
          this.messages.push(sentMessage);
          this.newMessage = '';
        },
        error: (err) => {
          console.error('Failed to send message', err);
        }
      });
    }
  }
}
