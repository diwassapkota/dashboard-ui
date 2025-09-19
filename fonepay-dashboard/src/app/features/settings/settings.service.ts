import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private apiService: ApiService) { }

  getUserSettings(): Observable<any> {
    return this.apiService.get('/settings');
  }

  updateUserSettings(settings: any): Observable<any> {
    return this.apiService.put('/settings', settings);
  }
}
