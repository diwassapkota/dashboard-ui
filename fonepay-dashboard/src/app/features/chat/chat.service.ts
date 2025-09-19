import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private apiService: ApiService) { }

  sendMessage(message: any): Observable<any> {
    return this.apiService.post('/chat/send', message);
  }

  getConversationHistory(conversationId: number): Observable<any> {
    return this.apiService.get(`/chat/history/${conversationId}`);
  }
}
