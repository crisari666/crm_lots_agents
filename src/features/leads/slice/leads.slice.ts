import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import { listMetaLeadForms } from "../../meta-lead-forms/services/meta-lead-forms.http"
import { convertAdminLead, listAdminLeads } from "../services/leads.http"
import type {
  LeadFormOption,
  LeadLifecycleStatus,
  LeadListItem,
  LeadSource,
  ListLeadsParams,
} from "../types/leads.types"

const DEFAULT_LIMIT = 50

export type LeadsFilters = {
  lifecycleStatus: LeadLifecycleStatus | ""
  source: LeadSource | ""
  formId: string
  search: string
  from: string
  to: string
}

export type LeadsState = {
  items: LeadListItem[]
  total: number
  page: number
  limit: number
  loading: boolean
  error: string | null
  filters: LeadsFilters
  formOptions: LeadFormOption[]
  formOptionsLoaded: boolean
  convertingId: string | null
  actionNotice: string | null
  actionError: string | null
}

const initialState: LeadsState = {
  items: [],
  total: 0,
  page: 0,
  limit: DEFAULT_LIMIT,
  loading: false,
  error: null,
  filters: {
    lifecycleStatus: "",
    source: "",
    formId: "",
    search: "",
    from: "",
    to: "",
  },
  formOptions: [],
  formOptionsLoaded: false,
  convertingId: null,
  actionNotice: null,
  actionError: null,
}

type ThunkState = { leads: LeadsState }

function axiosMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) {
      return data.message.join(", ")
    }
    if (typeof data?.message === "string") {
      return data.message
    }
  }
  return fallback
}

export const fetchLeadsThunk = createAsyncThunk(
  "leads/fetchList",
  async (_, { getState, rejectWithValue }) => {
    const { filters, page, limit } = (getState() as ThunkState).leads
    const params: ListLeadsParams = {
      page,
      limit,
      ...(filters.lifecycleStatus ? { lifecycleStatus: filters.lifecycleStatus } : {}),
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.formId.trim() ? { formId: filters.formId.trim() } : {}),
      ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
      ...(filters.from ? { from: filters.from } : {}),
      ...(filters.to ? { to: filters.to } : {}),
    }
    try {
      return await listAdminLeads(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.loadError))
    }
  }
)

export const fetchLeadFormOptionsThunk = createAsyncThunk(
  "leads/fetchFormOptions",
  async (_, { rejectWithValue }) => {
    try {
      const forms = await listMetaLeadForms()
      return forms.map(
        (form): LeadFormOption => ({
          id: form.id,
          formId: form.formId,
          formName: form.formName,
        }),
      )
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.loadError))
    }
  },
)

export const convertLeadThunk = createAsyncThunk(
  "leads/convert",
  async (
    payload: { customerId: string; assignToUserId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await convertAdminLead(payload.customerId, payload.assignToUserId)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.convertError))
    }
  }
)

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeadsFiltersAct: (state, action: PayloadAction<Partial<LeadsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 0
    },
    setLeadsPageAct: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    clearLeadsNoticeAct: (state) => {
      state.actionNotice = null
      state.actionError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeadsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = [...action.payload.items]
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchLeadsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? s.loadError
      })
      .addCase(fetchLeadFormOptionsThunk.fulfilled, (state, action) => {
        state.formOptions = action.payload
        state.formOptionsLoaded = true
      })
      .addCase(fetchLeadFormOptionsThunk.rejected, (state) => {
        state.formOptionsLoaded = true
      })
      .addCase(convertLeadThunk.pending, (state, action) => {
        state.convertingId = action.meta.arg.customerId
        state.actionError = null
      })
      .addCase(convertLeadThunk.fulfilled, (state, action) => {
        state.convertingId = null
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
        state.actionNotice = s.convertSuccess
      })
      .addCase(convertLeadThunk.rejected, (state, action) => {
        state.convertingId = null
        state.actionError = (action.payload as string) ?? s.convertError
      })
  },
})

export const { setLeadsFiltersAct, setLeadsPageAct, clearLeadsNoticeAct } = leadsSlice.actions
export default leadsSlice.reducer
