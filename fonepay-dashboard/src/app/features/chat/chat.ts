import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  // Placeholder for token. In a real app, this would come from a service.
  private token: string = 'your_jwt_token_here';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadConversations();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // --- Data Fetching ---

  loadConversations(): void {
    this.getConversations().subscribe({
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
        this.getConversationHistory(conversation.id).subscribe({
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

  // --- API Calls ---

  getConversations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history`, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  getConversationHistory(conversationId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history/${conversationId}`, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const userMessage = { sender: 'You', message: this.newMessage };
    this.messages.push(userMessage);

    const tempNewMessage = this.newMessage;
    this.newMessage = '';

    const aiMessage = { sender: 'AI', message: '' };
    this.messages.push(aiMessage);

    const payload = {
      conversationId: this.selectedConversation?.id,
      message: tempNewMessage
    };

    let isNewConversation = !this.selectedConversation?.id;

    this.performSsePost(payload).subscribe({
      next: (event: any) => {
        if (event.type === 'conversationId') {
          this.selectedConversation.id = event.data;
          if (isNewConversation) this.loadConversations();
        } else if (event.type === 'message') {
          aiMessage.message += event.data;
        }
      },
      error: (err) => {
        console.error('Failed to send message', err);
        aiMessage.message = 'Error: Could not get response.';
      },
      complete: () => {
        if (isNewConversation) this.loadConversations();
      }
    });
  }

  performSsePost(body: any): Observable<any> {
    return new Observable(observer => {
      const url = `${environment.apiUrl}/chat/send`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(body)
      }).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              if (buffer) this.processBuffer(buffer, observer);
              observer.complete();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.lastIndexOf('\n\n');
            if (boundary !== -1) {
              const completeMessages = buffer.substring(0, boundary);
              this.processBuffer(completeMessages, observer);
              buffer = buffer.substring(boundary + 2);
            }
            read();
          });
        };
        read();
      }).catch(err => observer.error(err));
    });
  }

  private processBuffer(buffer: string, observer: any) {
    const messages = buffer.split('\n\n');
    for (const msg of messages) {
      if (msg.trim()) {
        const event = this.parseSSEMessage(msg);
        if (event) observer.next(event);
      }
    }
  }

  private parseSSEMessage(message: string): { type: string, data: any } | null {
    if (!message) return null;
    let eventType = 'message';
    let eventData = '';
    const lines = message.split('\n');
    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        eventData += line.substring(5);
      }
    }
    if (eventData) return { type: eventType, data: eventData };
    return null;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
