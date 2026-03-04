import { CustomerInterface } from "../../../app/models/customer.interface";

export type CustomersCenterState = {
  loading: boolean,
  customers: CustomerInterface[],
  filter: CustomerCenterFilter
  dialogChangeCustomerUser?: DialogChangeCustomerUser
}

export type CustomerCenterFilter = {
  value: string
  dateStart: Date
  type: string
  step: string
  dateEnd: Date
  excludeDate: boolean
  office: string  
  userAssigned: string
}

export type DialogChangeCustomerUser = {
  customerName: string
  customerId: string
  currentUserName: string
  newUserId: string
  officeId: string
}