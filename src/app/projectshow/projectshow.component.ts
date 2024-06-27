import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingServiceService } from '../loading-service.service'
import { ProjectFormResponse } from '../interfaces/insert-form';


@Component({
  selector: 'app-projectshow',
  templateUrl: './projectshow.component.html',
  styleUrls: ['./projectshow.component.css']
})
export class ProjectshowComponent {
  projectId: any | null = null;
  projectData!: ProjectFormResponse ;

  constructor(private route: ActivatedRoute, private router: Router,private loadingServiceService: LoadingServiceService) {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['id'] ? +params['id'] : null;
      this.loadingServiceService.getProjectByProject(this.projectId).subscribe(
        (data: ProjectFormResponse) => {
          this.projectData = data;
          console.log(this.projectData);
        },
        error => {
          console.error('Error fetching positions:', error);
        }
      );
    });
  }

  graph() {
    if (this.projectId) {
      this.router.navigate(['/projectshow/loading'], { queryParams: { id: this.projectId } });
    } else {
      alert('Project ID not set');
    }
  }

  projectinfo() {
    if (this.projectId) {
      this.router.navigate(['/projectshow/projectdata'], { queryParams: { id: this.projectId } });
    } else {
      alert('Project ID not set');
    }
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.loadingServiceService.deleteProjectByProjectId(this.projectId).subscribe(
        () => {
          console.log('Project deleted successfully');
          this.router.navigate(['/home/projects']);
        },
        error => {
          console.error('Error deleting project:', error);
        }
      );
    }
  }

}
