import { CustomerCallActionsInterface } from "../../app/models/customer-call-actions.interface"
import { CustomerLogSituationsI } from "../../app/models/customer-logs.inteface"
import { CustomerInterface } from "../../app/models/customer.interface"
import { FeePaymentsResultI } from "../../app/models/fee-payment-result-inteface"
import { PaymentProjectType } from "../../app/models/payment.interface"

export type ReportsStateI = {
  loading: boolean
  imageToPreview?: string
  filter: ReportsFilterI
  customerLogResults?: CustomerLogSituationsI[],
  paymentsRequestsResults?: PaymentProjectType[] 
  feePayments?: FeePaymentsResultI[]
  callsReport?: RowCallReportItem[]
  callAssignedCustomer?: RowCallAssignedCustomer[]
  dialogCallAndNotesResume?: DialogCallAndNotesType
  usersDidNotCallsReport: LogCustomerNotCalledType[]
  imagePreviewPayment: string
  confirFeePaymentImageDialog?: FeePaymentConfirmData
  confirmFeePaymentPayedDialog?: FeePaymentConfirmPayed
  dialogValidateCall?: DialogValidateCall
  dialogValidateCallNote?: DialogValidateCallNote
  alertedPayments: PaymentProjectType[],
  usersGoalsResume: UserGoalResumeRow[],
  filterAlertedPayments: FilterAlertedPayments
}

export type DialogValidateCall = {
  image: string
  check: boolean
  callId: string
}

export type DialogValidateCallNote = {
  image: string
  check: boolean
  situationLogId: string
}


export type DialogCallAndNotesType = {
  callLogs: CustomerCallActionsInterface[], 
  callNotes: CustomerLogSituationsI[]
  customer: CustomerInterface
}


export type ReportsFilterI ={
  type: string
  office: string
  lead: string
  user: string
  startDate: string
  endDate: string
  collector?: CollectorResumeRowType
  [key: string]: any
}

export type CollectorResumeRowType = {_id: string, name: string, total: number, payments: FeePaymentsResultI[]}

export type FeePaymentConfirmData = {
  value: number
  feePaymentId: string
  index: number
}

export type FeePaymentConfirmPayed = {
  value: number
  feePaymentId: string
  index: number
  percentage: number
  remaining: number
}

export type Call = {
  _id: number;
  count: number;
  items: CallDateLog[]
};

export type CallDateLog = {
  date: string
  _id: string
}

export type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  office: string;
  lead: any[]; // Assuming 'any' type for 'lead' as no specific structure is provided
};

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  recycle: boolean;
  status: number;
  isProspect: boolean;
};

export type CustomerAssigned = Customer & {
  dateAssigned: string
}

export type RowCallReportItem = {
  calls: Call[];
  user: User[];
  customer: Customer[];
};

export type RowCallAssignedCustomer = CustomerAssigned & {
  calls: Call[];
  user: User[];
  notCalled: boolean;
}

export type UserGoalResumeRow = {
  _id: string
  name: string
  lastName: string
  email: string
  office: string
  goal: number
  payments: {
    _id: string | null
    expected: number
    payed: number
  }[]
  fees: {
    _id: string | null
    totalPayments: number
    totalTrusted: number
    totalUntrusted: number
    totalDownloaded: number
  }[]
}

export type FeeResumeType = {
  _id: string | null
  totalPayments: number
  totalTrusted: number
  totalUntrusted: number
  totalDownloaded: number
}

export type LogCustomerNotCalledType = {
  _id: string;
  user: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    office: {
      _id: string;
      name: string;
    };
  };
  customer: {
    _id: string;
    name: string;
    phone: string;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type FilterAlertedPayments = {
  office: string
  user: string
}