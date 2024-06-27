import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import { CargoesFormRequest, CheckTypeCargoesResponse, ContainerFormRequest } from '../interfaces/insert-form';
import { LoadingServiceService } from '../loading-service.service';


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
  isLoading: boolean = false;
  newProjectId:any;
  checkWeight: boolean = false;
  user:any;
  cargo:any;
  constructor(private loadingServiceService: LoadingServiceService, private router: Router, private msg: NzMessageService){}

  ngOnInit(): void {
    this.user = Number(localStorage.getItem('user_id'));


  }
  ngAfterViewInit(): void {

  }

  public ReadExcel(event:any){
    var fileName = event.target.files[0].name;
    console.log(fileName);

    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = async(e)=>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;
      this.cargoesData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.cargoesData );
      this.containerData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[1]])
      console.log(this.containerData);

      const isValid = await this.checkTypeCargoes(this.cargoesData);
      const isValid1 = await this.checkTypeContainer(this.containerData);
      if(!this.cargoesData || !this.containerData||this.cargoesData.length==0||this.containerData.length==0){
        alert('Please import the file in the specified format.');
        event.target.value = '';  // ลบค่าใน input file
        this.cargo_list = [];
        this.container_list = [];
        return
      }
      if (isValid && isValid1) {
        const isValidData = this.validateCargoesList(this.cargoesData);
        const isValidData1 = this.validateContainerList(this.containerData);
        if (isValidData&& isValidData1) {
          this.editdata();
        } else if(!isValidData){
          alert('Invalid cargo data. Please check the data and try again.');
          event.target.value = '';  // ลบค่าใน input file
          this.cargo_list = [];
          this.container_list = [];
        }else{
          alert('Invalid container data. Please check the data and try again.');
          event.target.value = '';  // ลบค่าใน input file
          this.cargo_list = [];
          this.container_list = [];
        }
      } else {
        alert('Some type_cargo values or type_container are invalid. Please choose another file.');
        event.target.value = '';  // ลบค่าใน input file
        this.cargo_list = [];
        this.container_list = [];
      }
    }
  }

  private validateCargoesList(cargoes: any[]): boolean {
    for (const cargo of cargoes) {
      if (!cargo.name ) {
        return false;
      }
      if (typeof cargo.type_cargo !== 'number') {
        return false;
      }
      if (typeof cargo.weight !== 'number' || cargo.weight < 0) {
        return false;
      }
      if (cargo.project_id !== undefined && typeof cargo.project_id !== 'number') {
        return false;
      }
    }
    return true;
  }
  private validateContainerList(container: any[]): boolean {
    for (const con of container) {
      if (typeof con.type_container !== 'number') {
        return false;
      }
      if (con.project_id !== undefined && typeof con.project_id !== 'number') {
        return false;
      }
    }
    return true;
  }

  private async checkTypeCargoes(cargoesData: any[]): Promise<boolean> {
    try {
      const typeCargoes = cargoesData.map(cargo => cargo.type_cargo);
      console.log(typeCargoes);

      const response = await this.loadingServiceService.checkTypeCargoes(typeCargoes).toPromise();
      const checkResponse = response as CheckTypeCargoesResponse;  // ใช้ Type Assertion
      return checkResponse.isValid;
    } catch (error) {
      console.error('Error checking type_cargoes', error);
      return false;
    }
  }

  private async checkTypeContainer(containerData: any[]): Promise<boolean> {
    try {
      const typeContainer = containerData.map(con => con.type_container);
      const response = await this.loadingServiceService.checkTypeContainer(typeContainer).toPromise();
      const checkResponse = response as CheckTypeCargoesResponse;  // ใช้ Type Assertion
      return checkResponse.isValid;
    } catch (error) {
      console.error('Error checking type_Container', error);
      return false;
    }
  }

  public async sendDataToReceiver() {
    this.isLoading = true;
    console.log(this.newProjectId);

    try {
      const gaResponse = await this.loadingServiceService.createGaAlgorithm(this.newProjectId).toPromise();
      console.log(gaResponse);
      this.isLoading = false;
      this.router.navigate(['/projectshow/loading'], { queryParams: { id: this.newProjectId } });
    } catch (error) {
      console.error(error);
    }
  }

  public async Submit(){
    if (!this.cargo_list || this.cargo_list.length == 0||!this.container_list || this.container_list.length == 0){
      alert("Please upload files.");
      return
    }else if(!this.projectName || this.projectName == ''){
      alert("Please input Project Name.");
      return
    }

    try {
      const projectResponse = await this.loadingServiceService.addNewProject(this.projectName, this.checkWeight,this.user).toPromise();
      console.log(projectResponse); // แสดงผลลัพธ์จาก Django Backend ในคอนโซล
      this.newProjectId = (projectResponse as any).id; // สมมติว่า response มีข้อมูล id ของโปรเจคที่ถูกสร้างใหม่
      this.editProjectId(this.newProjectId);
      console.log(this.newProjectId);


      const cargoesResponse = await this.loadingServiceService.addCargoes(this.cargo_list).toPromise();
      console.log(cargoesResponse);
      const containerResponse = await this.loadingServiceService.addContainer(this.container_list).toPromise();
      console.log(containerResponse);
      this.sendDataToReceiver();

    } catch (error) {

      console.error(error);
      //@ts-ignore
      alert(error.error.error);
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
