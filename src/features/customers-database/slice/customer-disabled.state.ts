import { CallsResumeI } from "../../../app/models/calls-resumet.interface"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { OfficeCampaignInterface } from "../../../app/models/office-campaign.interface"
import { OfficeLevelType } from "../../../app/models/office-level.type"
import { OfficeInterface } from "../../../app/models/office.inteface"
import { UserInterface } from "../../../app/models/user.interface"

export type CustomersDatabaseState = {
  loading: boolean
  customers: RowCustomer[]
  rowCustomers: RowCustomerDatabse[]
  officesCampaignsWithUsersWithCustomers: OfficesUsers[]
  userWithCustomers: UserAssignedWithCustomers[],
  customersAssigned: boolean
  expectedNumbers: number
  normalCampaign: boolean
  officesCampaigns: OfficeCampaignInterface[]
}

export type UserCustomersList = {
  customers: RowCustomerDatabse[]
}

export type UserAssignedWithCustomers = {} & UserAssigned & UserCustomersList

export type OfficesUsers = {
  lead: UserInterface
  office: OfficeInterface
  _id: string
  users: UserAssignedWithCustomers[]
}

export type RowCustomer = {
  checked: boolean
} & CustomerInterface

export type RowCustomerDatabse = {
  user: string
  _id: string
  name: string
  phone: string
  email: string
  date: string
  nAssigned: number
  nDisabled: number
  resumeCalls: CallsResumeI
  checked: boolean
}
export type UserAssigned = {
  _id: string;
  lastName: string;
  office: string
  email: string;
  rank: OfficeLevelType
};

export type Call = {
  _id: number;
  count: number;
};

export type Log = {
  user?: string;
  date: string;
  motive?: string;
};

export type HistoricalAssignation = {
  _id: string;
  log: Log[];
  count: number;
};

export type ItemCustomerDatabase = {
  _id: string;
  name: string;
  phone: string;
  codeId: string;
  email: string;
  status: number;
  userCreator: string;
  lead: string;
  userAssigned: UserAssigned[];
  answered: boolean;
  dateAsnwered: string;
  lastLog: null | string;
  dateAssigned: string;
  situation: any[];
  situationDate: string;
  code: string;
  step: any[];
  __v: number;
  calls: Call[];
  historicalAssignations: HistoricalAssignation[];
  historicalDisables: HistoricalAssignation[];
};

export type UserWithCustomersDatabaseType = {
  userId: string
  office: string
  customersId: string[]
}