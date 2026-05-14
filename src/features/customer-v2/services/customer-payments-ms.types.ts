export type CustomerPaymentItem = {
  id: string
  customerId: string
  projectId: string
  paymentValue: number
  datePayment: string
  receiptNumber?: string
  paymentMethod?: string
  notes?: string
  recordedBy: string
  hasEvidence: boolean
  createdAt: string
  updatedAt: string
}

export type CustomerPaymentSummaryItem = {
  projectId: string
  totalPaid: number
  paymentCount: number
}

export type CreateCustomerPaymentBody = {
  customerId: string
  projectId: string
  paymentValue: number
  datePayment: string
  receiptNumber?: string
  paymentMethod?: string
  notes?: string
}

export type CreateCustomerPaymentThunkInput = {
  body: CreateCustomerPaymentBody
  evidenceFile?: File
}

export type ListCustomerPaymentsParams = {
  customerId?: string
  projectId?: string
  dateFrom?: string
  dateTo?: string
  recordedBy?: string
  skip?: number
  limit?: number
}

export type ListCustomerPaymentsResponse = {
  data: CustomerPaymentItem[]
  total: number
}
