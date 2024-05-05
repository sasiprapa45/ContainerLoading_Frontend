import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoadingServiceService } from '../loading-service.service'
import { FormGroup, FormControl } from '@angular/forms';
import {CargoesFormRequest} from '../interfaces/insert-form'

@Component({
  selector: 'app-insertdata',
  templateUrl: './insertdata.component.html',
  styleUrls: ['./insertdata.component.css']
})
export class InsertdataComponent {
  // formData: CargoesFormRequest = {} ;
  formData:  CargoesFormRequest[] =[];
  projectName:any;
  cargoesData:any;
  ExcelData1:any;
  constructor(private loadingServiceService: LoadingServiceService){}



  public ReadExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.cargoesData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.cargoesData);

      this.ExcelData1 = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]])
      console.log(this.ExcelData1);
    }
  }


  public async Submit(){
    try {
      const projectResponse = await this.loadingServiceService.addNewProject(this.projectName).toPromise();
      console.log(projectResponse); // แสดงผลลัพธ์จาก Django Backend ในคอนโซล
      const newProjectId = (projectResponse as any).id; // สมมติว่า response มีข้อมูล id ของโปรเจคที่ถูกสร้างใหม่
      this.editProjectId(newProjectId);

      const cargoesResponse = await this.loadingServiceService.addCargoes(this.formData).toPromise();
      console.log(cargoesResponse);
    } catch (error) {
      console.error(error);
    }
  }

  private editProjectId(id:any){
  this.formData = [];
    this.cargoesData.forEach((data: any) => {
        const cargoData: CargoesFormRequest = {
            name: data.name.toString(),
            type_cargo: data.type_cargo,
            weight: data.weight,
            project_id: id,
        };
        this.formData.push(cargoData); // เพิ่มข้อมูลแต่ละรายการเข้าไปใน formData
    });

    console.log(this.formData);
  };


}
