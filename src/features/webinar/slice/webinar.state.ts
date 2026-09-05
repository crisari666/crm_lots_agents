import type {
  WebinarEvent,
  WebinarLead,
  WebinarLeadStatus,
} from "../types/webinar.types"

export type WebinarState = {
  readonly events: WebinarEvent[]
  readonly eventsLoading: boolean
  readonly eventsError: string | null
  readonly selectedEventId: string | null
  readonly selectedEvent: WebinarEvent | null
  readonly detailLoading: boolean
  readonly detailError: string | null
  readonly leads: WebinarLead[]
  readonly leadsTotal: number
  readonly leadsPage: number
  readonly leadsLimit: number
  readonly leadsStatusFilter: WebinarLeadStatus | ""
  readonly leadsLoading: boolean
  readonly leadsError: string | null
  readonly convertingLeadId: string | null
  readonly convertError: string | null
  readonly convertSuccessMessage: string | null
  readonly deletingLeadId: string | null
  readonly deleteLeadError: string | null
  readonly leadFormSubmitting: boolean
  readonly leadFormError: string | null
  readonly importSubmitting: boolean
  readonly importError: string | null
  readonly importResultSummary: string | null
  readonly formSubmitting: boolean
  readonly formError: string | null
  readonly deletingEvent: boolean
  readonly deleteError: string | null
}

export const initialWebinarState: WebinarState = {
  events: [],
  eventsLoading: false,
  eventsError: null,
  selectedEventId: null,
  selectedEvent: null,
  detailLoading: false,
  detailError: null,
  leads: [],
  leadsTotal: 0,
  leadsPage: 1,
  leadsLimit: 50,
  leadsStatusFilter: "",
  leadsLoading: false,
  leadsError: null,
  convertingLeadId: null,
  convertError: null,
  convertSuccessMessage: null,
  deletingLeadId: null,
  deleteLeadError: null,
  leadFormSubmitting: false,
  leadFormError: null,
  importSubmitting: false,
  importError: null,
  importResultSummary: null,
  formSubmitting: false,
  formError: null,
  deletingEvent: false,
  deleteError: null,
}
