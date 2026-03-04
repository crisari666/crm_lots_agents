import { PaymentInterface } from "./card-interface"

export interface UnpaidInterface {
  _id: string
  name: string
  card: string
  date: string
  payment: string | PaymentInterface
  payed: string
  value: string
  createdAt: string
  updatedAt: string
}
