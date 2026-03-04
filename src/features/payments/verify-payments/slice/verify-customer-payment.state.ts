import { CustomerInterface } from "../../../../app/models/customer.interface"
import { CustomerPaymentInterface } from "../../../../app/models/payment.interface"

export type VerifyCustomerPaymentsState = {
  loading: boolean
  customer?: CustomerInterface
  userNotFound: boolean
  payments: CustomerPaymentInterface[]
}
