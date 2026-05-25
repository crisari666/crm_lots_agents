import type { LeadCandidateRow } from "../types/lead-candidates.types"

function buildDefaultDateRange(): { readonly dateFrom: string; readonly dateTo: string } {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 30)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return { dateFrom: start.toISOString(), dateTo: end.toISOString() }
}

const defaultRange = buildDefaultDateRange()

export type LeadCandidatesSliceState = {
  readonly items: LeadCandidateRow[]
  readonly total: number
  readonly page: number
  readonly limit: number
  readonly isLoadingRows: boolean
  readonly isSubmitting: boolean
  readonly error: string | null
  readonly detailRow: LeadCandidateRow | null
  readonly isLoadingDetail: boolean
  readonly filters: {
    readonly dateFrom: string
    readonly dateTo: string
    readonly excludeDate: boolean
    readonly search: string
    readonly page: number
    readonly limit: number
  }
}

export const leadCandidatesInitialState: LeadCandidatesSliceState = {
  items: [],
  total: 0,
  page: 0,
  limit: 50,
  isLoadingRows: false,
  isSubmitting: false,
  error: null,
  detailRow: null,
  isLoadingDetail: false,
  filters: {
    dateFrom: defaultRange.dateFrom,
    dateTo: defaultRange.dateTo,
    excludeDate: false,
    search: "",
    page: 0,
    limit: 50,
  },
}
