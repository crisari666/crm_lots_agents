import { OfficeInterface } from "../../../app/models/office.inteface"

export interface HandleOfficeState {
  loading: boolean
  officeSaved: boolean
  currentOffice: OfficeInterface
}