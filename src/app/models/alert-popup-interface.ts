export interface AlertPopupStateI {
  title: string
  message: string
  type?: string
  onClose?: VoidFunction
  closeOnAction?: boolean
  actions?: ActionsAlertI[]
}

export interface ActionsAlertI {
  title: string
  action: (params?: any) => any
}
