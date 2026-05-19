import UserInterface from "../../app/models/user-interface";

export type HandleUserState = {
  currentUser?: UserInterface,
  created: boolean,
  loading: boolean,
  userId?: string,
  showPass: boolean
  leadsForOffice: UserInterface[]
}
