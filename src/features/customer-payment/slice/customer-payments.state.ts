import type {
  CustomerPaymentItem,
  CustomerPaymentSummaryItem,
} from "../../customer-v2/services/customer-payments-ms.types"

export type CustomerPaymentsState = {
  payments: CustomerPaymentItem[]
  total: number
  customerPayments: CustomerPaymentItem[]
  summaries: CustomerPaymentSummaryItem[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}
