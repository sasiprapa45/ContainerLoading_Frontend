import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CargoesFormRequest} from './interfaces/insert-form';
@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private apiUrl = 'http://localhost:8000/'

  constructor(private http: HttpClient) { }

  public addNewProject(projectName: string) {
    const apiUrl = this.apiUrl+`addProject/${projectName}/`; // เปลี่ยน URL เป็น URL ของ API Endpoint ใหม่
    return this.http.get(apiUrl);
  }

  public addCargoes(data: CargoesFormRequest[]) : Observable<any>{
    const api = this.apiUrl+'addCargoes/';
    return this.http.post(api, data);
  }

  public addContainer(data: any[]) : Observable<any>{
    const api = this.apiUrl+'addContainer';
    return this.http.post(api, data);
  }
}
