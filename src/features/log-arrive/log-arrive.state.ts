import UserInterface from "../../app/models/user-interface"

export enum LogArriveStepEnum {
  initial,
  pickUser,
  scanFace,
  cancelScan
}

export type LogArriveSliceState = {
  loading: boolean,
  users: UserInterface[]
  showDialogNotRegisteredFaceId: boolean
  userPickedDescriptor?: Float32Array
  logArriveStep: LogArriveStepEnum
  userChoose: string
  successFaceAuth: boolean
}

