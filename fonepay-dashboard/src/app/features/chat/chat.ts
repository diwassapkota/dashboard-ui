import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.loadConversations();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
        if (data.length > 0) {
          this.selectConversation(data[0]);
        } else {
          this.startNewConversation();
        }
      },
      error: (err) => {
        console.error('Failed to load conversations', err);
        this.startNewConversation();
      }
    });
  }

  selectConversation(conversation: any): void {
    if (conversation && conversation.id) {
        this.selectedConversation = conversation;
        this.chatService.getConversationHistory(conversation.id).subscribe({
        next: (data) => {
            this.messages = data.map((m: any) => ({
              ...m,
              sender: m.sender === 'USER' ? 'You' : 'AI'
            }));
        },
        error: (err) => {
            console.error('Failed to load messages for conversation ' + conversation.id, err);
        }
        });
    } else if (conversation) {
        this.startNewConversation();
    }
  }

  startNewConversation(): void {
    this.selectedConversation = { id: null, title: 'New Chat' };
    this.messages = [];
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const userMessage = {
        sender: 'You',
        message: this.newMessage
      };
      this.messages.push(userMessage);

      const tempNewMessage = this.newMessage;
      this.newMessage = '';

      const aiMessage = {
        sender: 'AI',
        message: ''
      };
      this.messages.push(aiMessage);

      const payload = {
        conversationId: this.selectedConversation?.id,
        message: tempNewMessage
      };

      let isNewConversation = !this.selectedConversation?.id;

      this.chatService.sendMessage(payload).subscribe({
        next: (event: any) => {
          if (event.type === 'conversationId') {
            this.selectedConversation.id = event.data;
            if (isNewConversation) {
                this.loadConversations();
            }
          } else if (event.type === 'message') {
            aiMessage.message += event.data + ' ';
          }
        },
        error: (err) => {
          console.error('Failed to send message', err);
          aiMessage.message = 'Error: Could not get response.';
        },
        complete: () => {
            if (isNewConversation) {
                this.loadConversations();
            }
        }
      });
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
