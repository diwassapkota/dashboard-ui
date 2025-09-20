import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from './chat.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: number | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.currentUserId = decodedToken.userId;
    }
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
    if (conversation.id) {
        this.selectedConversation = conversation;
        this.chatService.getConversationHistory(conversation.id).subscribe({
        next: (data) => {
            this.messages = data.map((m: any) => ({
            ...m,
            sender: m.userId === this.currentUserId ? 'You' : 'AI'
            }));
        },
        error: (err) => {
            console.error('Failed to load messages', err);
        }
        });
    } else {
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
        message: this.newMessage,
        userId: this.currentUserId
      };
      this.messages.push(userMessage);
      this.newMessage = '';

      const aiMessage = {
        sender: 'AI',
        message: '',
        userId: 0 // AI user id
      };
      this.messages.push(aiMessage);

      const payload = {
        conversationId: this.selectedConversation?.id,
        message: userMessage.message
      };

      let isNewConversation = !this.selectedConversation?.id;

      this.chatService.sendMessage(payload).subscribe({
        next: (event: any) => {
          console.log('Event received in component:', event);
          if (event.type === 'conversationId') {
            this.selectedConversation.id = event.data;
            if (isNewConversation) {
                this.loadConversations(); // Refresh conversation list
            }
          } else if (event.type === 'message') {
            aiMessage.message += event.data + ' ';
          }
        },
        error: (err) => {
          console.error('Failed to send message', err);
          aiMessage.message = 'Error: Could not get response.';
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
