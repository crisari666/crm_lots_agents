import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import {
  convertWebinarLead,
  createWebinarEvent,
  createWebinarLead,
  deleteWebinarEvent,
  deleteWebinarLead,
  getWebinarEvent,
  importWebinarLeads,
  listWebinarEvents,
  listWebinarLeads,
  updateWebinarEvent,
} from "../services/webinar.http"
import type {
  CreateWebinarEventBody,
  CreateWebinarLeadBody,
  ImportWebinarLeadsBody,
  UpdateWebinarEventBody,
  WebinarLeadStatus,
} from "../types/webinar.types"
import { initialWebinarState } from "./webinar.state"

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error != null && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string" && message.length > 0) {
      return message
    }
  }
  return fallback
}

export const fetchWebinarEventsThunk = createAsyncThunk(
  "webinar/fetchEvents",
  async () => listWebinarEvents()
)

export const fetchWebinarEventByIdThunk = createAsyncThunk(
  "webinar/fetchEventById",
  async (eventId: string) => getWebinarEvent(eventId)
)

export const createWebinarEventThunk = createAsyncThunk(
  "webinar/createEvent",
  async (body: CreateWebinarEventBody) => createWebinarEvent(body)
)

export const updateWebinarEventThunk = createAsyncThunk(
  "webinar/updateEvent",
  async (input: { readonly eventId: string; readonly body: UpdateWebinarEventBody }) =>
    updateWebinarEvent(input.eventId, input.body)
)

export const fetchWebinarLeadsThunk = createAsyncThunk(
  "webinar/fetchLeads",
  async (input: {
    readonly webinarEventId: string
    readonly status?: WebinarLeadStatus | ""
    readonly page?: number
    readonly limit?: number
  }) => {
    const status =
      input.status != null && input.status !== "" ? input.status : undefined
    return listWebinarLeads({
      webinarEventId: input.webinarEventId,
      ...(status != null ? { status } : {}),
      page: input.page ?? 1,
      limit: input.limit ?? 50,
    })
  }
)

export const convertWebinarLeadThunk = createAsyncThunk(
  "webinar/convertLead",
  async (leadId: string) => convertWebinarLead(leadId)
)

export const createWebinarLeadThunk = createAsyncThunk(
  "webinar/createLead",
  async (body: CreateWebinarLeadBody) => createWebinarLead(body)
)

export const importWebinarLeadsThunk = createAsyncThunk(
  "webinar/importLeads",
  async (body: ImportWebinarLeadsBody) => importWebinarLeads(body)
)

export const deleteWebinarLeadThunk = createAsyncThunk(
  "webinar/deleteLead",
  async (leadId: string) => {
    await deleteWebinarLead(leadId)
    return leadId
  }
)

export const deleteWebinarEventThunk = createAsyncThunk(
  "webinar/deleteEvent",
  async (eventId: string) => {
    await deleteWebinarEvent(eventId)
    return eventId
  }
)

const webinarSlice = createSlice({
  name: "webinar",
  initialState: initialWebinarState,
  reducers: {
    setSelectedWebinarEventId(state, action: PayloadAction<string | null>) {
      state.selectedEventId = action.payload
      state.selectedEvent = null
      state.leads = []
      state.leadsTotal = 0
      state.convertSuccessMessage = null
      state.convertError = null
      state.deleteLeadError = null
      state.leadFormError = null
      state.importError = null
      state.importResultSummary = null
      state.detailError = null
    },
    setWebinarLeadsStatusFilter(
      state,
      action: PayloadAction<WebinarLeadStatus | "">
    ) {
      state.leadsStatusFilter = action.payload
    },
    clearWebinarFormError(state) {
      state.formError = null
    },
    clearWebinarLeadFormError(state) {
      state.leadFormError = null
    },
    clearWebinarImportFeedback(state) {
      state.importError = null
      state.importResultSummary = null
    },
    clearWebinarConvertFeedback(state) {
      state.convertError = null
      state.convertSuccessMessage = null
      state.deleteLeadError = null
      state.importResultSummary = null
    },
    resetWebinarState() {
      return initialWebinarState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebinarEventsThunk.pending, (state) => {
        state.eventsLoading = true
        state.eventsError = null
      })
      .addCase(fetchWebinarEventsThunk.fulfilled, (state, action) => {
        state.eventsLoading = false
        state.events = action.payload
      })
      .addCase(fetchWebinarEventsThunk.rejected, (state, action) => {
        state.eventsLoading = false
        state.eventsError = resolveErrorMessage(action.error, "Error al cargar eventos")
      })
      .addCase(fetchWebinarEventByIdThunk.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchWebinarEventByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false
        state.selectedEvent = action.payload
        state.selectedEventId = action.payload.id
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index >= 0) {
          state.events[index] = action.payload
        }
      })
      .addCase(fetchWebinarEventByIdThunk.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = resolveErrorMessage(action.error, "Error al cargar el evento")
      })
      .addCase(createWebinarEventThunk.pending, (state) => {
        state.formSubmitting = true
        state.formError = null
      })
      .addCase(createWebinarEventThunk.fulfilled, (state, action) => {
        state.formSubmitting = false
        state.events = [action.payload, ...state.events.filter((e) => e.id !== action.payload.id)]
        if (action.payload.status === "active") {
          state.events = state.events.map((event) =>
            event.id === action.payload.id
              ? event
              : event.status === "active"
                ? { ...event, status: "closed" }
                : event
          )
        }
        state.selectedEventId = action.payload.id
        state.selectedEvent = action.payload
      })
      .addCase(createWebinarEventThunk.rejected, (state, action) => {
        state.formSubmitting = false
        state.formError = resolveErrorMessage(action.error, "Error al crear el evento")
      })
      .addCase(updateWebinarEventThunk.pending, (state) => {
        state.formSubmitting = true
        state.formError = null
      })
      .addCase(updateWebinarEventThunk.fulfilled, (state, action) => {
        state.formSubmitting = false
        state.selectedEvent = action.payload
        state.selectedEventId = action.payload.id
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index >= 0) {
          state.events[index] = action.payload
        } else {
          state.events = [action.payload, ...state.events]
        }
        if (action.payload.status === "active") {
          state.events = state.events.map((event) =>
            event.id === action.payload.id
              ? event
              : event.status === "active"
                ? { ...event, status: "closed" }
                : event
          )
        }
      })
      .addCase(updateWebinarEventThunk.rejected, (state, action) => {
        state.formSubmitting = false
        state.formError = resolveErrorMessage(action.error, "Error al actualizar el evento")
      })
      .addCase(fetchWebinarLeadsThunk.pending, (state) => {
        state.leadsLoading = true
        state.leadsError = null
      })
      .addCase(fetchWebinarLeadsThunk.fulfilled, (state, action) => {
        state.leadsLoading = false
        state.leads = action.payload.items
        state.leadsTotal = action.payload.total
        state.leadsPage = action.payload.page
        state.leadsLimit = action.payload.limit
      })
      .addCase(fetchWebinarLeadsThunk.rejected, (state, action) => {
        state.leadsLoading = false
        state.leadsError = resolveErrorMessage(action.error, "Error al cargar leads")
      })
      .addCase(convertWebinarLeadThunk.pending, (state, action) => {
        state.convertingLeadId = action.meta.arg
        state.convertError = null
        state.convertSuccessMessage = null
      })
      .addCase(convertWebinarLeadThunk.fulfilled, (state, action) => {
        state.convertingLeadId = null
        state.convertSuccessMessage = "Lead convertido a cliente"
        const index = state.leads.findIndex((lead) => lead.id === action.payload.id)
        if (index >= 0) {
          state.leads[index] = action.payload
        }
      })
      .addCase(convertWebinarLeadThunk.rejected, (state, action) => {
        state.convertingLeadId = null
        state.convertError = resolveErrorMessage(action.error, "Error al convertir el lead")
      })
      .addCase(createWebinarLeadThunk.pending, (state) => {
        state.leadFormSubmitting = true
        state.leadFormError = null
      })
      .addCase(createWebinarLeadThunk.fulfilled, (state, action) => {
        state.leadFormSubmitting = false
        const matchesFilter =
          state.leadsStatusFilter === "" ||
          state.leadsStatusFilter === action.payload.status
        if (matchesFilter) {
          state.leads = [
            action.payload,
            ...state.leads.filter((lead) => lead.id !== action.payload.id),
          ]
          state.leadsTotal += 1
        }
        state.convertSuccessMessage = "Lead agregado"
      })
      .addCase(createWebinarLeadThunk.rejected, (state, action) => {
        state.leadFormSubmitting = false
        state.leadFormError = resolveErrorMessage(
          action.error,
          "Error al crear el lead"
        )
      })
      .addCase(importWebinarLeadsThunk.pending, (state) => {
        state.importSubmitting = true
        state.importError = null
        state.importResultSummary = null
      })
      .addCase(importWebinarLeadsThunk.fulfilled, (state, action) => {
        state.importSubmitting = false
        const { created, alreadyExists, errors, notificationsSent } = action.payload
        state.importResultSummary = `Importados: ${created} creados, ${alreadyExists} ya existían, ${errors} errores, ${notificationsSent} WhatsApp enviados`
        state.convertSuccessMessage = state.importResultSummary
      })
      .addCase(importWebinarLeadsThunk.rejected, (state, action) => {
        state.importSubmitting = false
        state.importError = resolveErrorMessage(
          action.error,
          "Error al importar leads"
        )
      })
      .addCase(deleteWebinarLeadThunk.pending, (state, action) => {
        state.deletingLeadId = action.meta.arg
        state.deleteLeadError = null
        state.convertSuccessMessage = null
      })
      .addCase(deleteWebinarLeadThunk.fulfilled, (state, action) => {
        state.deletingLeadId = null
        const deletedId = action.payload
        state.leads = state.leads.filter((lead) => lead.id !== deletedId)
        state.leadsTotal = Math.max(0, state.leadsTotal - 1)
        state.convertSuccessMessage = "Lead eliminado"
      })
      .addCase(deleteWebinarLeadThunk.rejected, (state, action) => {
        state.deletingLeadId = null
        state.deleteLeadError = resolveErrorMessage(
          action.error,
          "Error al eliminar el lead"
        )
      })
      .addCase(deleteWebinarEventThunk.pending, (state) => {
        state.deletingEvent = true
        state.deleteError = null
      })
      .addCase(deleteWebinarEventThunk.fulfilled, (state, action) => {
        state.deletingEvent = false
        const deletedId = action.payload
        state.events = state.events.filter((event) => event.id !== deletedId)
        if (state.selectedEventId === deletedId) {
          state.selectedEventId = null
          state.selectedEvent = null
          state.leads = []
          state.leadsTotal = 0
        }
      })
      .addCase(deleteWebinarEventThunk.rejected, (state, action) => {
        state.deletingEvent = false
        state.deleteError = resolveErrorMessage(action.error, "Error al eliminar el evento")
      })
  },
})

export const {
  setSelectedWebinarEventId,
  setWebinarLeadsStatusFilter,
  clearWebinarFormError,
  clearWebinarLeadFormError,
  clearWebinarImportFeedback,
  clearWebinarConvertFeedback,
  resetWebinarState,
} = webinarSlice.actions

export const selectWebinarState = (state: RootState) => state.webinar

export default webinarSlice.reducer
