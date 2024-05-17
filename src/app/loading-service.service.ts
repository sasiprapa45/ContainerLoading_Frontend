import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CargoesFormRequest, ContainerFormRequest, ContainerFormResponse, PositionCargoesFormResponse} from './interfaces/insert-form';
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

  public addContainer(data: ContainerFormRequest[]) : Observable<any>{
    const api = this.apiUrl+'addContainer/';
    return this.http.post(api, data);
  }

  public createGaAlgorithm(projectId: number) {
    const apiUrl = this.apiUrl+`create_ga_algorithm/${projectId}/`; // เปลี่ยน URL เป็น URL ของ API Endpoint ใหม่
    return this.http.get(apiUrl);
  }

  public getPositionsByProject(projectId: number): Observable<PositionCargoesFormResponse[]> {
    return this.http.get<PositionCargoesFormResponse[]>(`${this.apiUrl}positions/${projectId}/`);
  }

  public getContainerByProject(projectId: number): Observable<ContainerFormResponse[]> {
    return this.http.get<ContainerFormResponse[]>(`${this.apiUrl}container_by_pid/${projectId}/`);
  }
}
