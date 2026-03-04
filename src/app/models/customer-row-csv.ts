import { CustomerInterface } from "./customer.interface"
import UserInterface from "./user-interface"

export interface CustomerRowCSVI {
  name: string
  phone: string
  email: string
  lead: string
  customer?: CustomerInterface
  add?: boolean
  user?: UserInterface

}