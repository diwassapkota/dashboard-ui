import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  getConversations(): Observable<any> {
    return this.apiService.get('/chat/history');
  }

  getConversationHistory(conversationId: number): Observable<any> {
    return this.apiService.get(`/chat/history/${conversationId}`);
  }

  sendMessage(message: any): Observable<any> {
    return new Observable(observer => {
      const token = this.authService.getToken();
      fetch(`${environment.apiUrl}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message)
      }).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              if (buffer) {
                this.processBuffer(buffer, observer);
              }
              observer.complete();
              return;
            }
            const chunk = decoder.decode(value, { stream: true });
            console.log('SSE Chunk Received:', chunk);
            buffer += chunk;

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
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  private processBuffer(buffer: string, observer: any) {
    const messages = buffer.split('\n\n');
    for (const msg of messages) {
      if (msg.trim()) {
        const event = this.parseSSEMessage(msg);
        if (event) {
          console.log('Parsed SSE Event:', event);
          observer.next(event);
        }
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
            // Do not trim the data to preserve spaces
            eventData += line.substring(5);
        }
    }
    if (eventData) {
        return { type: eventType, data: eventData };
    }
    return null;
  }
}
