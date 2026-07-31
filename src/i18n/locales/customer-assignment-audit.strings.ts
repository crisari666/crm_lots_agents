export const customerAssignmentAuditStrings = {
  title: "Historial de asignaciones",
  subtitle: "Clientes asignados a un usuario en el rango de fechas seleccionado.",
  assigneeLabel: "Usuario asignado",
  search: "Buscar",
  emptyAssignee: "Seleccione un usuario asignado para buscar.",
  resultCount: (total: number) =>
    `${total} registro${total === 1 ? "" : "s"}`,
  attendanceSummary: (attendedCount: number, avgLabel: string) =>
    `Atendidos: ${attendedCount} · Prom. tiempo a atender: ${avgLabel}`,
  colDate: "Fecha",
  colCustomer: "Cliente",
  colPreviousAssignee: "Asignado anterior",
  colAssignedTo: "Asignado a",
  colActor: "Realizado por",
  colAttendedAt: "Atendido",
  colTimeToAttend: "Tiempo a atender",
  noRows: "Sin resultados para los filtros aplicados.",
  loadError: "No se pudo cargar el historial de asignaciones.",
} as const
