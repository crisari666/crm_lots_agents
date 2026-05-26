export type LeadCandidateRow = {
  readonly id: string
  readonly name: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly normalizedEmail: string
  readonly normalizedPhone: string
  readonly sourceType: string
  readonly sourceExternalId?: string
  readonly sourceMeta: Record<string, unknown>
  readonly status: string
  readonly promotedUserId?: string
  readonly legacyUserId?: string
  readonly migrationBatchId?: string
  readonly migratedFromUser: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

export type LeadCandidateListResult = {
  readonly items: LeadCandidateRow[]
  readonly total: number
  readonly page: number
  readonly limit: number
}

export type CreateLeadCandidatePayload = {
  readonly name: string
  readonly lastName?: string
  readonly email: string
  readonly phone: string
}

export type UpdateLeadCandidatePayload = CreateLeadCandidatePayload

export type ListLeadCandidatesParams = {
  readonly dateFrom?: string
  readonly dateTo?: string
  readonly excludeDate: boolean
  readonly search: string
  readonly page: number
  readonly limit: number
}
