import type { CustomerDownPaymentItem } from "../../customer-v2/services/customer-payments-ms.types"

export type CustomerPaymentsState = {
  payments: CustomerDownPaymentItem[]
  total: number
  customerDownPayments: CustomerDownPaymentItem[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}
