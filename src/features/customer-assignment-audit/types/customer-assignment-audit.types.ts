export type CustomerAssignmentChangeItem = {
  changeLogId: string
  customerId: string
  customerName?: string
  customerLastName?: string
  customerPhone?: string
  occurredAt: string
  actorUserId?: string
  assignedFrom?: string
  assignedTo?: string
  action: "create" | "update"
  attendedAt?: string
  timeToAttendMs?: number
}

export type ListCustomerAssignmentChangesParams = {
  assigneeUserId: string
  dateFrom: string
  dateTo: string
  limit?: 100 | 200 | 500
  skip?: number
}

export type ListCustomerAssignmentChangesResponse = {
  items: CustomerAssignmentChangeItem[]
  total: number
  limit: number
  skip: number
  attendedCount: number
  avgTimeToAttendMs: number | null
}
