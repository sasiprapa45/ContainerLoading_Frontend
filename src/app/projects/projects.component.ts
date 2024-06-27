import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingServiceService } from '../loading-service.service';
import { ProjectFormResponse } from '../interfaces/insert-form';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit  {

  projectData: ProjectFormResponse[] =[];
  user_id:any;

  constructor(private route: Router, private loadingServiceService: LoadingServiceService) { }
  ngOnInit(): void {
    this.user_id = Number(localStorage.getItem('user_id'));
    this. getProject();
  }

  private getProject(): any {
    this.loadingServiceService.getProject(this.user_id ).subscribe(
      (data: ProjectFormResponse[]) => {
        this.projectData = data;
        console.log(this.projectData);
      },
      error => {
        console.error('Error fetching positions:', error);
      }
    );
  }


  viewProject(projectId: number | undefined): void {
    if (projectId !== undefined) {
      this.route.navigate(['/projectshow/loading'], { queryParams: { id: projectId } });
    }
  }
}
