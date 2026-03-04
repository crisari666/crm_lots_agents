import { CustomerCallActionsInterface } from "../../../app/models/customer-call-actions.interface"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { LeadWithUsersInterface } from "../../../app/models/lead-with-user.interface"
import UserInterface from "../../../app/models/user-interface"

export type CustomersState = {
  loading: boolean
  users: UserInterface[]
  leads: LeadWithUsersInterface[]
  showFormCustomer: boolean,
  newCustomerForm: NewCustomerFormI
  customers: CustomerInterface[]
  customersOriginal: CustomerInterface[]
  userByOfficeChose: UserInterface[]
  loadingUsers: boolean,
  dialogCallUser?: DialogCallUser
  customerCallActions: CustomerCallActionsInterface[]
  userAnswered: boolean,
  dialogUpdateCustomerSituation?: DialogUpdateCustomerSituationI
  customersFilter: CustomersFilter
  dialogCustomerStep?: DialogCustomerStep,
  customerCallDialogState: CustomerCallDialogState
}

export type CustomerCallDialogState = {
  answered: boolean
  note: string
  minutes: number
  seconds: number
  [key: string]: any
}

export type NewCustomerFormI = {
  name: string
  customerId?: string
  lastName: string
  phone: string
  email: string
  address: string
  office: string
  userAssigned: string | null
  [key: string]:  any
}

export type CustomersFilter = {
  office: string
  lead: string
  user: string
  date: string
  step: string
  [key: string]: string
}

export type DialogCallUser = {
  customerId: string
  phone: string
  email?: string
  description?: string
}

export type DialogCustomerStep = {
  customerId: string
  name: string
  stepId: string
}

export type DialogUpdateCustomerSituationI = {
  name: string
  _id: string
  newSitutation: string
  code: string
  date: string
  currentCode: string
  statusCode: "unknown" | "valid" | "checking" | "invalid"
  current: string
}

export type CustomerWasTreatedType = {
  isFromDatabase: boolean,
  calls: boolean
}