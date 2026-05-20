export type ImportCustomerRowStatus = 'pending' | 'created' | 'already_exists' | 'error'

export type ImportCustomerRowPreview = {
  name: string
  phone: string
  email: string
  assignedTo?: string
  status?: ImportCustomerRowStatus
  customerId?: string
  errorMessage?: string
}

export type ImportCustomersState = {
  previewRows: ImportCustomerRowPreview[]
  loading: boolean
  fileLoaded: boolean
  distributeUserIds: string[]
  assigneePatchLoadingByPhone: Record<string, boolean>
}
