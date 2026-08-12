import { OfficeLevelType } from "./office-level.type"

export default interface UserInterface {
  _id?: string
  name: string
  lastName: string
  phone: string
  phoneJob: string
  email: string
  password?: string
  level?: number
  user?: string;
  document?: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  token?: string;
  office?: string | OfficeDataNameI;
  offices?: OfficeDataNameI[];
  lead?: string;
  subadmin?: string | SubadminDataNameI;
  connected: boolean
  percentage: number
  lastConnection?: string
  enable: boolean
  link: string
  leaveDate?: string
  goal?: number
  rank?: OfficeLevelType
  role?: string
  root: boolean
  physical?: boolean
  /** Live presence: currently working on land (distinct from permanent physical). */
  isOnLand?: boolean
  autoCustomerAssignmentDisabled?: boolean
  /** When false, CRM may send first-access welcome email (password is null). From API only. */
  hasPassword?: boolean
  [key: string]: any
}

export type OfficeDataNameI = {
  name: string
  enable: boolean
  _id: string
}

export type SubadminDataNameI = {
  name: string
  lastName?: string
  _id: string
}