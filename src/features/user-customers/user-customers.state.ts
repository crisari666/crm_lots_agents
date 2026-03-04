import { ExpectedPaymentRow } from "../../app/models/expected-payment-row-interface"
import { UserPaymentRowI } from "../../app/models/user-payments-row.interface"

export type UserCustomersState = {
  loading: boolean
  activeCustomers: number
  customers: UserResumeRow[]
  resumeUsers: CustomerResumeUsers
  customerFilter: UserCustomerFilterDate
  userPaymentsFilter: UserCustomerFilterDate
  paymentsResume: PaymentResumeI
  customerStepLogs: CustomerStepLogRow[]
}

export type PaymentResumeI = {
  done: UserPaymentRowI[]
  expected: ExpectedPaymentRow[]
}

export type CustomerResumeUsers = {
  actives: number,
  pendings: number
  success: number
}

export type UserCustomerFilterDate =  {
  dateStart: Date,
  dateEnd: Date,
}

export type DateRangeI  = {
  dateStart: string,
  dateEnd: string,
}

export type SituationDetail  = {
  _id: string;
  title: string;
}

export type Situation  = {
  _id: string;
  situation: SituationDetail[];
  date: string;
}

export type Fee  = {
  _id: string;
  payments: number;
}

export type UserResumeRow  = {
  _id: string;
  name: string;
  status: number;
  answered: boolean;
  dateAssigned: string;
  situation: Situation[];
  fees: Fee[];
  'payments-expected': Fee[];
}

export type CustomerStepLogRow = {
  _id: string;
  customer: string;
  date: string;
  customerData: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  payments: {
    _id: string;
    valueExpected: number;
    valuePayed: number;
    anulated: boolean;
  }[];
}