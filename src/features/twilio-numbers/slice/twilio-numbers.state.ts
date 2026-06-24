import { TwilioNumberType } from "../../../app/models/twilio-number.type"
import UserInterface from "../../../app/models/user-interface"

export type TwilioListFilter = {
  officeId: string
  search: string
}

export type DeleteTwilioNumberTarget = {
  PNID: string
  number: string
  friendlyNumber: string
  userEmail: string | null
}

export type TwilioNumbersState = {
  loading: boolean
  twilioNumberForm: TwilioNumbersForm
  displayTwilioNumberForm: boolean
  editingPNID: string | null
  twilioNumbers: TwilioNumberType[]
  users: UserInterface[]
  displayRelUserToNumberForm: boolean
  relUserToNumberDialog: RelUserToNumberDialog
  twilioListFilter: TwilioListFilter
  displayDeleteTwilioNumberDialog: boolean
  deleteTwilioNumberTarget: DeleteTwilioNumberTarget | null
  deleteTwilioNumberError: string | null
}

export type TwilioNumbersForm = {
  PNID: string
  number: string
  friendlyNumber: string
  [key: string]: string
}

export type RelUserToNumberDialog = {
  twilioNumber: string
  userId: string
  PNID: string
}