import { OfficeCustomersResumeRow } from "../../app/models/office-customers-resume-row"
import { OfficePaymentsResume } from "../../app/models/office-dashboard-payment-row"
import { OfficeInterface } from "../../app/models/office.inteface"

export interface OfficeDashboardState {
  loading: boolean
  currentOffice?: OfficeInterface
  paymentsResume: OfficePaymentsResume
  customersResume: OfficeCustomersResumeRow[]
  customersResumeActive: OfficeDashboardCustomerResumeRow[]
  paymentResumeFilter: {
    dateStart: Date
    dateEnd: Date,
  },
  customersResumeFilter: {
    dateStart: Date
    dateEnd: Date,
  },
}

export interface OfficeDashboardCustomerResumeRow {

  _id: string
  name: string
  lastName: string
  email: string
  activeCustomers: number
}