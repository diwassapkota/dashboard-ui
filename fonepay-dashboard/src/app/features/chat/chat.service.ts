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
    // Assuming an endpoint to get all conversations
    // This might need to be created in the backend.
    // Returning a mock for now.
    return new Observable(observer => {
      observer.next([
        { id: 1, title: 'Customer Support' },
        { id: 2, title: 'Technical Issues' },
        { id: 3, title: 'Billing Inquiries' }
      ]);
      observer.complete();
    });
    // return this.apiService.get('/chat/conversations');
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

        function read() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                const eventType = line.substring(6).trim();
                const dataLine = lines.find(l => l.startsWith('data:'));
                if (dataLine) {
                  const data = dataLine.substring(5).trim();
                  observer.next({ type: eventType, data: data });
                }
              } else if (line.startsWith('data:')) {
                const data = line.substring(5).trim();
                observer.next({ type: 'message', data: data });
              }
            }
            read();
          });
        }
        read();
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
