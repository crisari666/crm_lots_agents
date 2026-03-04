import { UnpaidInterface } from "./unpaid-interface"
import UserInterface from "./user-interface"

export interface CardInterface {
  _id?: string
  name: string
  date?: Date
  address: string
  ocupation: string
  phone: string
  value: number
  total: number
  dailyPayment: number
  initalPayment?: number
  nPayments: number
  pendingPayment?: number
  user?: string | UserInterface
  customer?: any
  status: number
  percentage: number
  lat: number
  lng: number
  posAtRoute: number
  cardResume?: CardResumeInterface
  totalPayed?: number
  payments?: PaymentInterface[]
  todayPaymentsTotal?: number
  unpaids: UnpaidInterface[]
  nUnpaids: 0
}

export interface CardResumeInterface {
  payed: number
  nPayed: number
  pendingPayments: number
  remainingValue: number
}

export interface PaymentInterface {
  _id: string
  date: string
  card: string
  createdAt: string
  updatedAt: string
  value: number
}


