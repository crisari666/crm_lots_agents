import UserInterface from "../../app/models/user-interface"

export interface SigninStateI {
  loading: boolean
  success?: boolean
  currentUser?: UserInterface
  logout: boolean
  endSession: boolean
  endSessionForce: boolean,
  wrongCredential: boolean
  userPosition?: UserPositionI
}

export interface UserPositionI {
  lat: number
  lng: number
}