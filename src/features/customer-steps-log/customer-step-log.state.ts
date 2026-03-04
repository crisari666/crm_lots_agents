import { CustomerInterface } from "../../app/models/customer.interface"

export type CustomerStepsLogState  = {
  loading: boolean,
  formFitler: CustomerStepsFormFilter,
  customers: CustomerInterface[]
}

export type CustomerStepsFormFilter = {
  dateStart: string
  dateEnd: string,
  office?: string,
  step: string
  excludeDate: boolean
  [key: string]: any
}

