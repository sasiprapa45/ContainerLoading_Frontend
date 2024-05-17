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


export interface CargoesFormResponse {
  id?: number,
  name?: string,
  weight?: string,
  project_id?: number,
  type_cargo?: number,
}


export interface PositionCargoesFormResponse {
  id?: number,
  X?: number,
  Y?: number,
  Z?: number,
  cargoes_id?: number,
  name?: string,
  project_id?: number,
  type_cargo_id?: number,
  height?: number,
  width?: number,
  length?: number,
  container_id?: number,
}

export interface ContainerFormResponse {
  id?: number,
  type_container_id?: number,
  type_container_name: string,
  height?: number,
  width?: number,
  length?: number,
  project_id?: number,
}
