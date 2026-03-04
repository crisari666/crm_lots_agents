import { AppAutocompleteOption } from "../../../app/components/app-autocomplete"
import { PaymentDownloadedDb } from "../../../app/models/payment-dowload-db.type"
import { PaymentForDownloadType } from "../../../app/models/payment-for-download.type"

export type DownloadPaymentState = {
  loading: boolean
  showFindPaymentDialog: boolean,
  filterPaymentForm: FilterPaymentsForm
  foundPayments: PaymentForDownloadType[]
  pickedPayment?: PaymentForDownloadType
  paymentRouteCalc: PaymentRouteType
  showDialogPickPercentage: boolean
  typePercentageToPick: TypePercentageEnum
  recalculate: boolean
  dialogPercentage: DialogPercentageType
  lastUserPaymentDownloaded?: PaymentDownloadedDb
}

export type DialogPercentageType = {
  user: AppAutocompleteOption
  users: AppAutocompleteOption[]
  usersAdded: UserPercentageDataType[]
  percentage: number
}

export type UserPercentageDataType = {
  userId: string
  userNick: string
  percentage: number
}

export type FilterPaymentsForm = {
  dateInit: string
  dateEnd: string
  office: string
  userId: string
  downloaded: boolean
  collector: string
  [key: string]: string | boolean
}

export type PaymentRouteType = {
  collector: SinglePercentageType
  worker: SinglePercentageType
  leadWorker: SinglePercentageType
  officeLead: MultiplePercentageType
  subLead: MultiplePercentageType
  partner: MultiplePercentageType
  mainPartner: MultiplePercentageType
  copTotal: number
  usdPrice: number
}

export type SinglePercentageType = {
  userPercentageId?: string
  before: number
  after: number
  percentage: number
  user?: string
  userNick?: string
  value: number
}

export type MultiplePercentageType = {
  before: number
  after: number
  value: number
  percentage: number
  users: string[]
  userPercentageData: SinglePercentageData[]
}

export type SinglePercentageData = {
  before: number
  after: number
  percentage: number
  user: string
  userNick: string
  value: number
}

export interface WorkerPaymentHistoryItem {
  _id: string;
  copValue: number;
  usdValue: number;
  worker: {
    beforeVal: string;
    user: string;
    afterVal: number;
    value: number;
    percentage: number;
  };
  createdAt: string;
  campaign: {
    _id: string;
    dateStart: string;
    dateEnd: string;
    createdAt: string;
  };
}

export enum TypePercentageEnum {
  empty = '',
  collector = 'collector',
  worker = 'worker',
  leadWorker = 'leadWorker',
  officeLead = 'officeLead',
  subLead = 'subLead',
  partner = 'partner',
  mainPartner = 'mainPartner',
}