import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
isLoading = false;

constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

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
            sender: m.sender === 'USER' ? 'You' : 'Agent'
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
    if (this.newMessage.trim() && !this.isLoading) {
      this.isLoading = true;

      const userMessage = {
        sender: 'You',
        message: this.newMessage,
        userId: this.currentUserId
      };
      this.messages.push(userMessage);

      const messageToSend = this.newMessage;
      this.newMessage = '';

      const aiMessage = {
        sender: 'Agent',
        message: '',
        userId: 0
      };
      this.messages.push(aiMessage);

      const payload = {
        conversationId: this.selectedConversation?.id,
        message: messageToSend
      };

      this.chatService.sendMessage(payload).subscribe({
        next: (event: any) => {
          console.log('Event received in component:', event);
          if (event.type === 'message') {
            // Append tokens exactly as received (now with proper spacing preserved)
            aiMessage.message += event.data;

            // Force change detection for real-time streaming effect
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Failed to send message', err);
          aiMessage.message = 'Error: Could not get response.';
          this.isLoading = false;
        },
        complete: () => {
          console.log('Message stream completed');
          this.isLoading = false;

          // If we got no response content, show an error
          if (!aiMessage.message.trim()) {
            aiMessage.message = 'No response received from the server.';
          }
        }
      });
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
