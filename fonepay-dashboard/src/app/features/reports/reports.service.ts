import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private apiService: ApiService) { }

  getAllReports(): Observable<any> {
    return this.apiService.get('/reports');
  }

  createReport(report: any): Observable<any> {
    return this.apiService.post('/reports', report);
  }

  getReportById(id: number): Observable<any> {
    return this.apiService.get(`/reports/${id}`);
  }

  deleteReport(id: number): Observable<any> {
    return this.apiService.delete(`/reports/${id}`);
  }
}
