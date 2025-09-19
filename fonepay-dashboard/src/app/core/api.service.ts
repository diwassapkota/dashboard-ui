import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get(path: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`);
  }

  post(path: string, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, body);
  }

  put(path: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, body);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`);
  }
}
