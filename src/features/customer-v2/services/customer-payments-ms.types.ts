export type CustomerPaymentFeeItem = {
  id: string
  downPaymentId: string
  customerId: string
  projectId: string
  paymentValue: number
  datePayment: string
  receiptNumber?: string
  paymentMethod?: string
  notes?: string
  recordedBy: string
  hasEvidence: boolean
  evidenceMimeType?: string
  createdAt: string
  updatedAt: string
}

export type CustomerDownPaymentItem = {
  id: string
  customerId: string
  projectId: string
  lotNumber: string
  expectedValue: number
  status: "pending" | "completed"
  totalPaid: number
  feeCount: number
  remaining: number
  customerName?: string
  projectName?: string
  recordedBy: string
  hasContract: boolean
  contractMimeType?: string
  createdAt: string
  updatedAt: string
  fees?: CustomerPaymentFeeItem[]
}

export type CreateCustomerDownPaymentBody = {
  customerId: string
  projectId: string
  lotNumber: string
  expectedValue: number
  firstPaymentValue: number
  datePayment: string
  receiptNumber?: string
  paymentMethod?: string
  notes?: string
  customerName?: string
  projectName?: string
}

export type CreateCustomerDownPaymentThunkInput = {
  body: CreateCustomerDownPaymentBody
  contractFile: File
  evidenceFile?: File
}

export type CreateCustomerPaymentFeeBody = {
  paymentValue: number
  datePayment: string
  receiptNumber?: string
  paymentMethod?: string
  notes?: string
}

export type CreateCustomerPaymentFeeThunkInput = {
  downPaymentId: string
  body: CreateCustomerPaymentFeeBody
  evidenceFile?: File
}

export type ListCustomerDownPaymentsParams = {
  customerId?: string
  projectId?: string
  dateFrom?: string
  dateTo?: string
  recordedBy?: string
  status?: "pending" | "completed"
  skip?: number
  limit?: number
}

export type ListCustomerDownPaymentsResponse = {
  data: CustomerDownPaymentItem[]
  total: number
}

/** @deprecated legacy flat payment */
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
