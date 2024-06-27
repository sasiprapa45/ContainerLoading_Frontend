import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserFormRequest } from '../interfaces/insert-form';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.router.navigate(['login']);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}user/${userId}/`);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}user/${userId}/`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}user/${userId}/`);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

}
