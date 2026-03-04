import { CustomerRowCSVI } from "./customer-row-csv"

export interface LeadNumbersPreviewInterface {
  _id: string
  name: string
  user: string
  numbers: CustomerRowCSVI[]
}