export type PaymentPercentage = {
  beforeVal: number
  user: string
  value: number
  percentage: number
  afterVal: number
}

export type PaymentPercentageGroup = {
  beforeVal: number
  percentage: number
  value: number
  afterVal: number
  users: string []
  usersPercentage: PercentageData[]
}

export type PercentageData = {
  user: string
  percentage: number
  value: number
}

export type AdminPercentage = {
  user: string
  value: number
  percentage: number
}

export type PaymentRouteModel = {
  payment: string
  copValue: number
  usdPrice: number
  collector: PaymentPercentage  
  worker: PaymentPercentage
  leadWorker: PaymentPercentage
  officeLead: PaymentPercentageGroup
  subleads: PaymentPercentageGroup
  partners: PaymentPercentageGroup
  admins: AdminPercentage[]
  
}