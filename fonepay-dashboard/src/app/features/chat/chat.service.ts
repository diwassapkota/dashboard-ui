import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
providedIn: 'root'
})
export class ChatService {

constructor(private http: HttpClient, private authService: AuthService) {}

  getConversations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history`);
  }

  getConversationHistory(conversationId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat/history/${conversationId}`);
  }

  // Fetch-based approach to preserve exact token spacing
  sendMessage(payload: any): Observable<any> {
    return new Observable(observer => {
      // const url = `${environment.apiUrl}/v1/llm/ollama?message=${encodeURIComponent(payload.message)}`;
      const url = `${environment.apiUrl}/chat/ollama`;

      fetch(url, {
        method: 'POST',
        // Remove custom headers to avoid CORS preflight
        headers: {
          'Content-Type': 'application/json',
          // If auth is needed:
          'Authorization': `Bearer ${this.authService.getToken()}`,
        },
        body: JSON.stringify({ message: payload.message, conversationId: payload.conversationId })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('ReadableStream not supported');
        }

        const decoder = new TextDecoder();

        const readStream = () => {
          reader!.read().then(({ done, value }) => {
            if (done) {
              console.log('Stream completed');
              observer.complete();
              return;
            }

            // Decode the chunk - this preserves exact spacing including leading spaces
            const chunk = decoder.decode(value, { stream: true });
            console.log('Received chunk:', JSON.stringify(chunk));

            // Handle completion marker
            if (chunk.includes('[DONE]')) {
              console.log('Stream completed with DONE marker');
              // Send any remaining content before the [DONE] marker
              const contentBeforeDone = chunk.split('[DONE]')[0];
              if (contentBeforeDone) {
                observer.next({ type: 'message', data: contentBeforeDone });
              }
              observer.complete();
              return;
            }

            // Send the chunk exactly as received (preserves spaces)
            if (chunk) {
              observer.next({ type: 'message', data: chunk });
            }

            readStream(); // Continue reading
          }).catch(error => {
            console.error('Stream reading error:', error);
            observer.error(error);
          });
        };

        readStream();
      })
      .catch(error => {
        console.error('Fetch error:', error);
        observer.error(error);
      });

      // Cleanup function
      return () => {
        console.log('Streaming cancelled');
      };
    });
  }
}
