import { OfficeLevelType } from "../../../../app/models/office-level.type"

export type OfficesLevelState = {
  loading: boolean,
  officeLevelForm: OfficeLevelForm,
  officeLevels: OfficeLevelType[]
  officeLevelToEdit: string
}

export type OfficeLevelForm = {
  title: string,
  nCustomers: number,
  nCustomersDatabase: number,
  [key: string]: any  
}