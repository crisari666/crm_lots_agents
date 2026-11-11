export type AssignmentTimelineFlowStrategy = "immediate_assign" | "lead_conversation"

export type AssignmentTimelineClockMode = "assignedAt" | "arrivedAt"

export type AssignmentTimelineEvent = {
  readonly id: string
  readonly ventorId: string
  readonly customerId: string
  readonly customerName?: string
  readonly customerLastName?: string
  readonly customerPhone?: string
  readonly assignedAt: string
  readonly arrivedAt: string
  readonly flowStrategy?: AssignmentTimelineFlowStrategy
  readonly attendedAt?: string
}

export type AssignmentTimelineResult = {
  readonly windowFrom: string
  readonly windowTo: string
  readonly events: readonly AssignmentTimelineEvent[]
  readonly nextCursorBefore?: string
  readonly hasMoreOlder: boolean
}

export type ListAssignmentTimelineParams = {
  readonly dateFrom: string
  readonly dateTo: string
  readonly ventorId?: string
  readonly flowStrategy?: AssignmentTimelineFlowStrategy
  readonly cursorBefore?: string
  readonly limit?: number
}
