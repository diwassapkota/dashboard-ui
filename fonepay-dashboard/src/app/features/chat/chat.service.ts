import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getConversations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history`);
  }

  getConversationHistory(conversationId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history/${conversationId}`);
  }

  sendMessage(message: any): Observable<any> {
    const url = `${environment.apiUrl}/chat/send`;
    console.log('Sending POST request to:', url);
    console.log('Request body:', message);

    return new Observable(observer => {
      const req = this.http.post(url, message, {
        responseType: 'text',
        reportProgress: true,
        observe: 'events'
      });

      let buffer = '';
      const sub = req.subscribe({
        next: event => {
          if (event.type === HttpEventType.DownloadProgress) {
            const chunk = (event.partialText || '').substring(buffer.length);
            buffer = event.partialText || '';
            console.log('SSE Chunk Received:', chunk);

            let boundary = buffer.lastIndexOf('\n\n');
            if (boundary !== -1) {
              const completeMessages = buffer.substring(0, boundary);
              this.processBuffer(completeMessages, observer);
              buffer = buffer.substring(boundary + 2);
            }
          } else if (event.type === HttpEventType.Response) {
            if (buffer) {
              this.processBuffer(buffer, observer);
            }
            observer.complete();
          }
        },
        error: err => {
          observer.error(err);
        },
        complete: () => {
          if (buffer) {
            this.processBuffer(buffer, observer);
          }
          observer.complete();
        }
      });

      return () => {
        sub.unsubscribe();
      };
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
        eventData += line.substring(5);
      }
    }
    if (eventData) {
      return { type: eventType, data: eventData };
    }
    return null;
  }
}
