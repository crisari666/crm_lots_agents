import { UserPercentageType } from "../../../app/models/user-percentage.type"

export type UsersPercentageState = {
  loading: boolean
  userPercentageDialog?: UserPercentageDialog
  usersPercentageRows: UserPercentageType[]
  usersPercentageFiltered: UserPercentageType[]
}


export type UserPercentageDialog = {
  _id?: string
  user: string
  percentage: number
  office: string
  type: TypePercentageEnum
  [key: string]: any
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