export interface CargoesFormRequest {
  name?: string,
  type_cargo?: number,
  weight?: number,
  project_id?: number,
}

export interface CargoesFormResponse {
  id?: number,
  name?: string,
  weight?: string,
  project_id_id?: number,
  type_cargo_id?: number,
}
