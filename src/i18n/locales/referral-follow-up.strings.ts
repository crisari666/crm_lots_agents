export const referralFollowUpStrings = {
  pageTitle: "Seguimiento referidos",
  addButton: "Registrar seguimiento",
  dialogTitle: "Nuevo registro de seguimiento",
  eventLabel: "Evento",
  descriptionLabel: "Descripción",
  userLabel: "Usuario (referido)",
  cancel: "Cancelar",
  save: "Guardar",
  saving: "Guardando…",
  dateFilterLabel: "Rango de fechas",
  listTitle: "Registros",
  emptyList: "No hay registros en el rango seleccionado.",
  columns: {
    userName: "Usuario",
    situation: "Situación",
    description: "Descripción",
    date: "Fecha",
  },
  loadError: "No se pudo cargar la información.",
  saveError: "No se pudo guardar el registro.",
} as const

export const referralSituationEventLabels: Record<string, string> = {
  callWhatsapp: "Llamada / WhatsApp",
  chat: "Chat",
  other: "Otro",
  videoCall: "Videollamada",
}
