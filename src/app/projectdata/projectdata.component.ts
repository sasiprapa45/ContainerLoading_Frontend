import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from '../loading-service.service';
import { CargoesFormRequest, CargoesFormResponse, ContainerFormRequest, ContainerFormResponse, PositionCargoesFormResponse, ProjectFormResponse } from '../interfaces/insert-form';
import * as XLSX from 'xlsx'
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-projectdata',
  templateUrl: './projectdata.component.html',
  styleUrls: ['./projectdata.component.css']
})
export class ProjectdataComponent implements OnInit {
  projectId: any | null = null;
  projectData!: ProjectFormResponse;
  cargo_list:  CargoesFormResponse[] =[];
  container_list:  ContainerFormResponse[] =[];
  position_list: PositionCargoesFormResponse[] = []
  projectName:any;
  cargoesData:any;
  containerData:any;
  isLoading: boolean = false;
  newProjectId:any;

  constructor(private route: ActivatedRoute, private loadingServiceService: LoadingServiceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['id'] ? +params['id'] : null;
      if (this.projectId) {
        forkJoin([
          this.loadingServiceService.getProjectByProject(this.projectId),
          this.loadingServiceService.getContainerByProject(this.projectId),
          this.loadingServiceService.getPositionsByProject(this.projectId),
          this.loadingServiceService.getCargoesByProject(this.projectId)
        ]).subscribe(
          ([projectData, containerData, positionData, cargoData]) => {
            this.projectData = projectData;
            this.container_list = containerData;
            this.position_list = positionData;
            this.cargo_list = cargoData;
            // console.log('Project Data:', this.projectData);
            console.log('Container List:', this.container_list);
            // console.log('Position Data:', this.position_list);
            // console.log('Cargo List:', this.cargo_list);
          },
          error => {
            console.error('Error fetching data:', error);
          }
        );
      }
    });

  }

  ngAfterViewInit() {
  }


  public ReadExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.cargoesData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.cargoesData );
      this.containerData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]])
      console.log(this.containerData);

      // this.editdata();
    }
  }

  // private editdata(){
  //   this.cargo_list =[];
  //   this.container_list = [];
  //   console.log(this.cargoesData);

  //   this.cargoesData.forEach((data: any) => {
  //       const cargoData: CargoesFormRequest = {
  //           name: data.name.toString(),
  //           type_cargo: data.type_cargo,
  //           weight: data.weight,
  //           project_id: this.projectId
  //       };
  //       this.cargo_list.push(cargoData); // เพิ่มข้อมูลแต่ละรายการเข้าไปใน cargo_list
  //   });
  //   this.containerData.forEach((data: any) => {
  //     const conData: ContainerFormRequest = {
  //         type_container: data.type_container,
  //         project_id: this.projectId
  //     };
  //     this.container_list.push(conData);
  //   });
  // };


  trackByIndex(index: number, item: CargoesFormResponse): number {
    return index;
  }
  trackByIndex1(index: number, item: ContainerFormRequest): number {
    return index;
  }

}
