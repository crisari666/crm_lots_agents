import { CollectorType } from "../../../app/models/collector.type"
import { CustomerCallActionsInterface } from "../../../app/models/customer-call-actions.interface"
import { CustomerDocPayType } from "../../../app/models/customer-doc-pay.type"
import { CustomerLogSituationsI } from "../../../app/models/customer-logs.inteface"
import { CustomerResume } from "../../../app/models/customer-resume-model"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { FeeInterface } from "../../../app/models/fee.interface"
import { CustomerPaymentInterface } from "../../../app/models/payment.interface"
import { SituationInterface } from "../../../app/models/situation-interface"
import UserInterface from "../../../app/models/user-interface"
import { CustomerWasTreatedType } from "../customers-list/customers.state"

export type CustomerViewStateI = {
  loading: boolean
  customerData?: CustomerInterface
  situations: SituationInterface[],
  formNewSituation: CustomerSituationFormI
  customerLogs: CustomerLogSituationsI[]
  customerPaymentForm: CustomerPaymentFormI
  debtCollectors: UserInterface[]
  customerPayments: CustomerPaymentInterface[]
  dialogAddFee?: DialogAddFeeI
  feePaymentsHistory?: FeeHistoryPaymentDialogStateI
  imagePreview: string
  imageSituationZoom?: string
  showDialogImageSituation: boolean
  showDialogSureDisableCustomer: boolean
  customerResume?: CustomerResume
  customerWasTreated?: CustomerWasTreatedType,
  customerChangeUserForm: CustomerChangeUserForm,
  collectors: CollectorType[]
  customerCallActions: CustomerCallActionsInterface[]
  openModalPayDocs: boolean
  customerDocPays: CustomerDocPayType[]
}

export type CustomerChangeUserForm = {
  office: string
  user: string
  [key: string]: string 
}

export type FeeHistoryPaymentDialogStateI = {
  feePayment: FeeInterface[]
}

export type DialogAddFeeI = {
  customer: string
  value: number
  collector: string
  paymentRequest: string
  [key: string]: any
}

export type CustomerSituationFormI = {
  situation: string,
  note: string
  [key: string]: string
}

export type CustomerPaymentFormI = {
  value: number,
  date: string,
  done: boolean
  step: string
  paymentAlerted: boolean
  [key: string]: any
}