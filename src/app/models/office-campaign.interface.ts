import UserInterface from "./user-interface"

export type OfficeCampaignInterface  = {
  _id: string
  office: string
  users: string[] | UserInterface[]
  usersDatabase: UserInterface[] | string[]
  user: string 
  createdAt: string
  automaticMode?: boolean
  updatedAt: string
  allow: boolean
  allowDatabase: boolean
  checked: boolean
}

export type UserAtCampaignInterface = {
  name: string
  user: string
  lastName: string
  _id: string
}