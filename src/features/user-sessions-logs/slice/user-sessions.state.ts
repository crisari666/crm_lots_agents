import { UserLoginLogInterface } from "../../../app/models/user-login-log.interface"


export type UserSesionLogInterface = {
  userId: string
  loading: boolean
  form: UserSessionFormState
  logs: UserLoginLogInterface[]
  userName: string
  userTimeForm: UserTimeArriveForm
}

export type UserSessionFormState = {
  start: string
  end: string
  [key: string]: string
}

export type UserTimeArriveForm = {
  time: string
}