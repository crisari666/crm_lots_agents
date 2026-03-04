import UserInterface from "../../../app/models/user-interface"

export type UsersListState = {
  users: UserInterface[]
  audits: UserInterface[]
  usersOriginal: UserInterface[]
  loading: boolean,
  search_string: string
  gotUsers: boolean
  modalChangeofficeState?: ModalChangeUserI
  officeIdFilter: string
  leadsForOfficeChose: UserInterface[],
  dialogSetUserLink?: DialogSetUserLink
  displayFormRankedUser: boolean
  userRankedForm: UserRankedForm
  onlyEnableUsers: boolean
}

export type UserRankedForm = {
  userId: string
  userName: string
  officeLevelId: string
  [key: string] : string
}

export type ModalChangeUserI = {
  office: string
  lead: string
  newOffice: string
  userName: string
  userId: string
  [key: string]: any
}

export type DialogSetUserLink = {
  name: string
  userId: string  
  link: string
}