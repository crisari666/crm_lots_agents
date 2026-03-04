import { OfficeInterface } from "../../../app/models/office.inteface"
import { UserArriveLogType } from "../../../app/models/user-arrive-log.type"

export type QrArriveState = {
  loading: boolean
  registeringArrive: boolean
  userPicked: string
  qrCode: string,
  errorMessage: string
  office?: OfficeInterface
  usersArriveLogs: {[user: string]: UserArriveLogType}
}