import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
export interface CargoesFormRequest {
  name?: string,
  type_cargo?: number,
  weight?: number,
  project_id?: number,
}

export interface ContainerFormRequest {
  type_container?: number,
  project_id?: number,
}


export interface ProjectFormRequest {
  project_name?: string,
  weight_check?: boolean,
}
export interface CheckTypeCargoesResponse {
  isValid: boolean;
  invalidTypeCargoes?: number[];  // ตัวเลือก (optional) หากคุณต้องการข้อมูลเพิ่มเติม
}


export interface CargoesFormResponse {
  id?: number,
  name?: string,
  weight?: string,
  project_id?: number,
  type_cargo?: number,
  type_cargo_name?: string,
  height?: number,
  width?: number,
  length?: number,
}


export interface PositionCargoesFormResponse {
  id?: number,
  X?: number,
  Y?: number,
  Z?: number,
  cargoes_id?: number,
  name?: string,
  weight?: number,
  project_id?: number,
  type_cargo_id?: number,
  height?: number,
  width?: number,
  length?: number,
  color?: string,
  container_id?: number,
}

export interface ContainerFormResponse {
  id?: number,
  packing_weight?: number,
  type_container_id?: number,
  limit_weight?: number,
  type_container_name?: string,
  height?: number,
  width?: number,
  length?: number,
  project_id?: number,
}


export interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<CargoesFormRequest[]> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<CargoesFormRequest[]> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}


export interface ProjectFormResponse {
  id?: number,
  name?: string,
  cargoes_qty?: number,
  cargoes_packed?: number,
  container_qty?: number,
  container_used?: number,
  fitness?: number,
  weight_check?: boolean,
  user?: number,
  username?: string,
}


export interface UserFormRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  age?: number;
  address?: string;
}

export interface UserFormResponse {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  address?: string;
}
