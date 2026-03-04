import { CustomerRowCSVI } from "./customer-row-csv"
import UserInterface from "./user-interface"

export type LeadsWithUsers = {
  _id: string
  email: string
  lastName: string
  officeCampaignId: string
  office: string
  users: {[userId: string] : UsersWithCustomer}
}

export type UsersWithCustomer = {
  _id: string
  userDb: UserInterface
  rank: UserRankType
  customers: CustomerRowCSVI[]
}

export type UserRankType = {
  _id: string
  title: string
  nCustomers: number
  nCustomersDatabase: number
}