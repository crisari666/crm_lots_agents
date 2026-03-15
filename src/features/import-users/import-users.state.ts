import { UserImportRowPayload, UserImportResultItem } from "../../app/services/users.service"

export type ImportUserRowPreview = UserImportRowPayload & {
  status?: UserImportResultItem['status']
  userId?: string
}

export type ImportUsersState = {
  previewRows: ImportUserRowPreview[]
  loading: boolean
  fileLoaded: boolean
}
