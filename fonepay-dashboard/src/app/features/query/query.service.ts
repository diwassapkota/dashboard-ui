import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private apiService: ApiService) { }

  executeQuery(query: string): Observable<any> {
    return this.apiService.post('/query/execute', { query });
  }

  getQueryHistory(): Observable<any> {
    return this.apiService.get('/query/history');
  }
}
