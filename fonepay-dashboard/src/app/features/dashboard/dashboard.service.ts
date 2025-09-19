import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) { }

  getMetrics(): Observable<any> {
    return this.apiService.get('/dashboard/metrics');
  }
}
