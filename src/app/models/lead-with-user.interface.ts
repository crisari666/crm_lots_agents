export interface LeadWithUsersInterface {
  _id: string
  name: string
  email: string
  level: number,
  office: string,
  users: UserFromLeadInterface[]
}

export interface UserFromLeadInterface {
  _id: string
  name: string
  email: string
  level: number,
}
