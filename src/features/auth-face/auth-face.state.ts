export type AuthFaceSliceState = {
  loading: boolean
  descriptorFromBack?: Float32Array
  modelsLoaded: boolean
  camStarted: boolean
  closeFaceToCam: boolean
  showSetAuthFaceDialog: boolean
  uploadingFile: boolean
  successAuthFaceRegister: boolean
  showDialogRegisterAuthFace: boolean
}

export type UserAuthFaceType = {
  userId: string
  descriptor: {[key: number]: number}
  _id: string
  createdAt: string
  updatedAt: string
}