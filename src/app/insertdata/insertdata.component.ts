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
  cargo_list:  CargoesFormRequest[] =[];
  container_list:  ContainerFormRequest[] =[];
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
      console.log(this.cargoesData );
      this.containerData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]])
      console.log(this.containerData);

      this.editdata();
    }
  }

  public async sendDataToReceiver() {
    this.isLoading = false
    console.log(this.newProjectId);

    try {
      const gaResponse = await this.loadingServiceService.createGaAlgorithm(this.newProjectId).toPromise();
      console.log(gaResponse);
      this.router.navigate(['/loading'], { queryParams: { id: this.newProjectId } });
    } catch (error) {
      console.error(error);
    }
  }

  public async Submit(){
    try {
      const projectResponse = await this.loadingServiceService.addNewProject(this.projectName).toPromise();
      console.log(projectResponse); // แสดงผลลัพธ์จาก Django Backend ในคอนโซล
      this.newProjectId = (projectResponse as any).id; // สมมติว่า response มีข้อมูล id ของโปรเจคที่ถูกสร้างใหม่
      this.editProjectId(this.newProjectId);

      const cargoesResponse = await this.loadingServiceService.addCargoes(this.cargo_list).toPromise();
      console.log(cargoesResponse);
      const containerResponse = await this.loadingServiceService.addContainer(this.container_list).toPromise();
      console.log(containerResponse);

    } catch (error) {
      console.error(error);
    }
  }

  private editdata(){
    this.cargo_list =[];
    this.container_list = [];
    console.log(this.cargoesData);

    this.cargoesData.forEach((data: any) => {
        const cargoData: CargoesFormRequest = {
            name: data.name.toString(),
            type_cargo: data.type_cargo,
            weight: data.weight,
        };
        this.cargo_list.push(cargoData); // เพิ่มข้อมูลแต่ละรายการเข้าไปใน cargo_list
    });
    this.containerData.forEach((data: any) => {
      const conData: ContainerFormRequest = {
          type_container: data.type_container,
      };
      this.container_list.push(conData);
    });
  };

  private editProjectId(id:any) {
    
    this.cargo_list.forEach((cargo: CargoesFormRequest) => {
      cargo.project_id = id;
    });
    console.log( this.cargo_list);
  
    // เพิ่มหรืออัพเดตค่า project_id สำหรับ container_list
    this.container_list.forEach((container: ContainerFormRequest) => {
      container.project_id = id;
    });
  }

  trackByIndex(index: number, item: CargoesFormRequest): number {
    return index;
  }
  trackByIndex1(index: number, item: ContainerFormRequest): number {
    return index;
  }

  // listOfColumns: CargoesFormRequest[] = [
  //   {
  //     name: 'Name',
  //     sortOrder: null,
  //     sortFn: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
  //     sortDirections: ['ascend', 'descend', null],
  //     filterMultiple: true,
  //     listOfFilter: [
  //       { text: 'Joe', value: 'Joe' },
  //       { text: 'Jim', value: 'Jim', byDefault: true }
  //     ],
  //     filterFn: (list: string[], item: DataItem) => list.some(name => item.name.indexOf(name) !== -1)
  //   },
  //   {
  //     name: 'Age',
  //     sortOrder: 'descend',
  //     sortFn: (a: DataItem, b: DataItem) => a.age - b.age,
  //     sortDirections: ['descend', null],
  //     listOfFilter: [],
  //     filterFn: null,
  //     filterMultiple: true
  //   },
  //   {
  //     name: 'Address',
  //     sortOrder: null,
  //     sortDirections: ['ascend', 'descend', null],
  //     sortFn: (a: DataItem, b: DataItem) => a.address.length - b.address.length,
  //     filterMultiple: false,
  //     listOfFilter: [
  //       { text: 'London', value: 'London' },
  //       { text: 'Sidney', value: 'Sidney' }
  //     ],
  //     filterFn: (address: string, item: DataItem) => item.address.indexOf(address) !== -1
  //   }
  // ];

  // listOfData: CargoesFormRequest[] = [
  //   {

  //     name: 'John Brown',

  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park'
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sidney No. 1 Lake Park'
  //   }
  // ];

}
