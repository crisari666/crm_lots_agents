import { UserDocType } from "../../app/models/user-doc.type";
import UserInterface from "../../app/models/user-interface";

export type HandleUserState = {
  currentUser?: UserInterface,
  created: boolean,
  loading: boolean,
  userId?: string,
  showPass: boolean
  leadsForOffice: UserInterface[]
  dialogUploadUserDoc?: DialogUploadUserDoc
  userDocs?: UserDocType
}


export type DialogUploadUserDoc = {
  documentType: string
}