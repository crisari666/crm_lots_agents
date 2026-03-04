export interface CapitalContributeStateI {
  dateInputFilter: string
  showModalForm: boolean
  loading: boolean
  contributeCapitalForm: CapitalContributeFormState
  history: CapitalContributeInterface[]
}

export interface CapitalContributeFormState {
  name: string
  value: number
  [key: string]: string | number
}

export interface CapitalContributeInterface {
  _id: string
  name: string
  user: string
  date: string
  createdAt: string
  updatedAt: string
  value: number
}
