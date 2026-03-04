import { FeePaymentsResultI } from "../../../app/models/fee-payment-result-inteface"

export interface UnstrudtedPaymentsState {
  loading: boolean
  payments: FeePaymentsResultI[]
  payForTrust?: FeePaymentsResultI
}