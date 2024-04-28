import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private apiUrl = 'http://localhost:8000/'

  constructor(private http: HttpClient) { }

  addNewProject(name: any) : Observable<any>{
    const api = this.apiUrl+'newProject';
    return this.http.post(api, name);
  }

  addCargoes(data: any[]) : Observable<any>{
    const api = this.apiUrl+'addCargoes';
    return this.http.post(api, data);
  }

  addContainer(data: any[]) : Observable<any>{
    const api = this.apiUrl+'addContainer';
    return this.http.post(api, data);
  }
}
