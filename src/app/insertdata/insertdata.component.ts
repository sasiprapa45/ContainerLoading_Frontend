import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoadingServiceService } from '../loading-service.service'
import { FormGroup, FormControl } from '@angular/forms';
import {CargoesFormRequest,ContainerFormRequest} from '../interfaces/insert-form'
import { Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-insertdata',
  templateUrl: './insertdata.component.html',
  styleUrls: ['./insertdata.component.css']
})
export class InsertdataComponent implements OnInit, AfterViewInit{
  formData:  CargoesFormRequest[] =[];
  formData1:  ContainerFormRequest[] =[];
  projectName:any;
  cargoesData:any;
  containerData:any;
  isLoading: boolean = true;
  newProjectId:any;

  constructor(private loadingServiceService: LoadingServiceService, private router: Router){}

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {

  }

  public ReadExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.cargoesData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.cargoesData);

      this.containerData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]])
      // console.log(this.containerData);
    }
  }
  public async sendDataToReceiver() {
    this.isLoading = false
    console.log(this.newProjectId);

    try {
      const gaResponse = await this.loadingServiceService.createGaAlgorithm(this.newProjectId).toPromise();
      console.log(gaResponse);
    } catch (error) {
      console.error(error);
    }
    this.router.navigate(['/loading'], { queryParams: { id: this.newProjectId } });
  }

  public async Submit(){
    try {
      const projectResponse = await this.loadingServiceService.addNewProject(this.projectName).toPromise();
      console.log(projectResponse); // แสดงผลลัพธ์จาก Django Backend ในคอนโซล
      this.newProjectId = (projectResponse as any).id; // สมมติว่า response มีข้อมูล id ของโปรเจคที่ถูกสร้างใหม่
      this.editProjectId(this.newProjectId);

      const cargoesResponse = await this.loadingServiceService.addCargoes(this.formData).toPromise();
      console.log(cargoesResponse);
      const containerResponse = await this.loadingServiceService.addContainer(this.formData1).toPromise();
      console.log(containerResponse);

    } catch (error) {
      console.error(error);
    }
  }

  private editProjectId(id:any){
  this.formData = [];
  this.formData1= [];
    this.cargoesData.forEach((data: any) => {
        const cargoData: CargoesFormRequest = {
            name: data.name.toString(),
            type_cargo: data.type_cargo,
            weight: data.weight,
            project_id: id,
        };
        this.formData.push(cargoData); // เพิ่มข้อมูลแต่ละรายการเข้าไปใน formData
    });

    this.containerData.forEach((data: any) => {
      const conData: ContainerFormRequest = {
          type_container: data.type_container,
          project_id: id,
      };
      this.formData1.push(conData);
    });

  };

}
