import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CargoesFormRequest, CargoesFormResponse, ContainerFormRequest, ContainerFormResponse, PositionCargoesFormResponse, ProjectFormRequest, ProjectFormResponse} from './interfaces/insert-form';
@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  private apiUrl = 'http://localhost:8000/'

  constructor(private http: HttpClient) { }

  public addNewProject(projectName: string, checkWeight: boolean, userId: number) {
    const apiUrl = `${this.apiUrl}addProject/`;
    return this.http.post(apiUrl, { projectName, checkWeight, userId });
  }

  // public addNewProject(data: ProjectFormRequest) {
  //   const apiUrl = this.apiUrl+`addProject/`; // เปลี่ยน URL เป็น URL ของ API Endpoint ใหม่
  //   return this.http.get(apiUrl);
  // }

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

  public getProjectByProject(projectId: number): Observable<ProjectFormResponse> {
    return this.http.get<ProjectFormResponse>(`${this.apiUrl}project_by_pid/${projectId}/`);
  }

  public deleteProjectByProjectId(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}deleteprojects/${projectId}/`);
  }


  public getCargoesByProject(projectId: number): Observable<CargoesFormResponse[]> {
    return this.http.get<CargoesFormResponse[]>(`${this.apiUrl}cargoes_by_pid/${projectId}/`);
  }

  public getProject(user_id: number): Observable<ProjectFormResponse[]> {
    return this.http.get<ProjectFormResponse[]>(`${this.apiUrl}projects/${user_id}/`);
  }

  public checkTypeCargoes(typeCargoes: number[]) {
    const apiUrl = `${this.apiUrl}checkTypeCargoes/`;
    return this.http.post(apiUrl, { typeCargoes });
  }

  public checkTypeContainer(typeContainer: number[]) {
    const apiUrl = `${this.apiUrl}checkTypeContainer/`;
    return this.http.post(apiUrl, { typeContainer });
  }
}
