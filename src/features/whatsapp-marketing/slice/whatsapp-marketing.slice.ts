import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import {
  cancelWhatsappMarketingCampaign,
  createWhatsappMarketingCampaign,
  getWhatsappMarketingCampaign,
  launchWhatsappMarketingCampaign,
  listWhatsappMarketingCampaigns,
  listWhatsappMarketingRecipients,
  previewWhatsappMarketingAudience,
  retryWhatsappMarketingRecipient,
} from "../services/customers-ms-whatsapp-marketing.http"
import type {
  AudiencePreviewBody,
  CreateWhatsappMarketingCampaignBody,
} from "../services/customers-ms-whatsapp-marketing.types"
import type { WhatsappMarketingState } from "./whatsapp-marketing.state"

const initialState: WhatsappMarketingState = {
  listItems: [],
  listLoading: false,
  listError: null,
  detailCampaignId: null,
  detailCampaign: null,
  detailLoading: false,
  detailError: null,
  recipients: [],
  recipientsStatusFilter: "",
  recipientsLoading: false,
  retryingRecipientId: null,
  cancelLoading: false,
  audiencePreview: null,
  audiencePreviewLoading: false,
  audiencePreviewError: null,
  createStatus: "idle",
  createError: null,
  lastCreatedCampaignId: null,
}

export const fetchWhatsappMarketingCampaignsThunk = createAsyncThunk(
  "whatsappMarketing/fetchCampaigns",
  async (params?: { limit?: number; skip?: number }) => {
    return listWhatsappMarketingCampaigns(params ?? { limit: 50, skip: 0 })
  },
)

export const fetchWhatsappMarketingDetailThunk = createAsyncThunk(
  "whatsappMarketing/fetchDetail",
  async (input: {
    readonly campaignId: string
    readonly statusFilter?: string
    readonly recipientsLimit?: number
  }) => {
    const statusFilter = input.statusFilter ?? ""
    const [campaign, recipients] = await Promise.all([
      getWhatsappMarketingCampaign(input.campaignId),
      listWhatsappMarketingRecipients(input.campaignId, {
        limit: input.recipientsLimit ?? 100,
        skip: 0,
        ...(statusFilter !== "" ? { status: statusFilter } : {}),
      }),
    ])
    return { campaign, recipients: recipients.items, statusFilter }
  },
)

export const previewWhatsappMarketingAudienceThunk = createAsyncThunk(
  "whatsappMarketing/previewAudience",
  async (body: AudiencePreviewBody) => previewWhatsappMarketingAudience(body),
)

export const createAndLaunchWhatsappMarketingCampaignThunk = createAsyncThunk(
  "whatsappMarketing/createAndLaunch",
  async (body: CreateWhatsappMarketingCampaignBody) => {
    const created = await createWhatsappMarketingCampaign(body)
    const launched = await launchWhatsappMarketingCampaign(created.id)
    return launched
  },
)

export const cancelWhatsappMarketingCampaignThunk = createAsyncThunk(
  "whatsappMarketing/cancel",
  async (campaignId: string) => cancelWhatsappMarketingCampaign(campaignId),
)

export const retryWhatsappMarketingRecipientThunk = createAsyncThunk(
  "whatsappMarketing/retryRecipient",
  async (input: { readonly campaignId: string; readonly recipientId: string }) => {
    await retryWhatsappMarketingRecipient(input.campaignId, input.recipientId)
    return input
  },
)

const whatsappMarketingSlice = createSlice({
  name: "whatsappMarketing",
  initialState,
  reducers: {
    setWhatsappMarketingRecipientsStatusFilterAct: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.recipientsStatusFilter = action.payload
    },
    resetWhatsappMarketingCreateAct: (state) => {
      state.createStatus = "idle"
      state.createError = null
      state.lastCreatedCampaignId = null
    },
    resetWhatsappMarketingAudiencePreviewAct: (state) => {
      state.audiencePreview = null
      state.audiencePreviewLoading = false
      state.audiencePreviewError = null
    },
    clearWhatsappMarketingDetailAct: (state) => {
      state.detailCampaignId = null
      state.detailCampaign = null
      state.detailError = null
      state.recipients = []
      state.recipientsStatusFilter = ""
      state.retryingRecipientId = null
      state.cancelLoading = false
    },
    clearWhatsappMarketingErrorsAct: (state) => {
      state.listError = null
      state.detailError = null
      state.audiencePreviewError = null
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhatsappMarketingCampaignsThunk.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchWhatsappMarketingCampaignsThunk.fulfilled, (state, action) => {
        state.listLoading = false
        state.listItems = action.payload.items
      })
      .addCase(fetchWhatsappMarketingCampaignsThunk.rejected, (state, action) => {
        state.listLoading = false
        state.listError =
          action.error.message != null
            ? action.error.message
            : "Error al cargar campañas"
      })
      .addCase(fetchWhatsappMarketingDetailThunk.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
        state.recipientsLoading = true
      })
      .addCase(fetchWhatsappMarketingDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false
        state.recipientsLoading = false
        state.detailCampaignId = action.payload.campaign.id
        state.detailCampaign = action.payload.campaign
        state.recipients = action.payload.recipients
        state.recipientsStatusFilter = action.payload.statusFilter
      })
      .addCase(fetchWhatsappMarketingDetailThunk.rejected, (state, action) => {
        state.detailLoading = false
        state.recipientsLoading = false
        state.detailError =
          action.error.message != null
            ? action.error.message
            : "Error al cargar campaña"
      })
      .addCase(previewWhatsappMarketingAudienceThunk.pending, (state) => {
        state.audiencePreviewLoading = true
        state.audiencePreviewError = null
      })
      .addCase(previewWhatsappMarketingAudienceThunk.fulfilled, (state, action) => {
        state.audiencePreviewLoading = false
        state.audiencePreview = action.payload
      })
      .addCase(previewWhatsappMarketingAudienceThunk.rejected, (state, action) => {
        state.audiencePreviewLoading = false
        state.audiencePreview = null
        state.audiencePreviewError =
          action.error.message != null
            ? action.error.message
            : "Error en vista previa"
      })
      .addCase(createAndLaunchWhatsappMarketingCampaignThunk.pending, (state) => {
        state.createStatus = "submitting"
        state.createError = null
      })
      .addCase(createAndLaunchWhatsappMarketingCampaignThunk.fulfilled, (state, action) => {
        state.createStatus = "success"
        state.lastCreatedCampaignId = action.payload.id
        state.detailCampaign = action.payload
        state.detailCampaignId = action.payload.id
      })
      .addCase(createAndLaunchWhatsappMarketingCampaignThunk.rejected, (state, action) => {
        state.createStatus = "error"
        state.createError =
          action.error.message != null
            ? action.error.message
            : "Error al crear campaña"
      })
      .addCase(cancelWhatsappMarketingCampaignThunk.pending, (state) => {
        state.cancelLoading = true
      })
      .addCase(cancelWhatsappMarketingCampaignThunk.fulfilled, (state, action) => {
        state.cancelLoading = false
        state.detailCampaign = action.payload
      })
      .addCase(cancelWhatsappMarketingCampaignThunk.rejected, (state, action) => {
        state.cancelLoading = false
        state.detailError =
          action.error.message != null
            ? action.error.message
            : "Error al cancelar campaña"
      })
      .addCase(retryWhatsappMarketingRecipientThunk.pending, (state, action) => {
        state.retryingRecipientId = action.meta.arg.recipientId
      })
      .addCase(retryWhatsappMarketingRecipientThunk.fulfilled, (state) => {
        state.retryingRecipientId = null
      })
      .addCase(retryWhatsappMarketingRecipientThunk.rejected, (state, action) => {
        state.retryingRecipientId = null
        state.detailError =
          action.error.message != null
            ? action.error.message
            : "Error al reintentar"
      })
  },
})

export const {
  setWhatsappMarketingRecipientsStatusFilterAct,
  resetWhatsappMarketingCreateAct,
  resetWhatsappMarketingAudiencePreviewAct,
  clearWhatsappMarketingDetailAct,
  clearWhatsappMarketingErrorsAct,
} = whatsappMarketingSlice.actions

const selectSlice = (state: RootState): WhatsappMarketingState => state.whatsappMarketing

export const selectWhatsappMarketingListItems = createSelector(
  [selectSlice],
  (s) => s.listItems,
)
export const selectWhatsappMarketingListLoading = createSelector(
  [selectSlice],
  (s) => s.listLoading,
)
export const selectWhatsappMarketingListError = createSelector(
  [selectSlice],
  (s) => s.listError,
)
export const selectWhatsappMarketingDetailCampaign = createSelector(
  [selectSlice],
  (s) => s.detailCampaign,
)
export const selectWhatsappMarketingDetailLoading = createSelector(
  [selectSlice],
  (s) => s.detailLoading,
)
export const selectWhatsappMarketingDetailError = createSelector(
  [selectSlice],
  (s) => s.detailError,
)
export const selectWhatsappMarketingRecipients = createSelector(
  [selectSlice],
  (s) => s.recipients,
)
export const selectWhatsappMarketingRecipientsStatusFilter = createSelector(
  [selectSlice],
  (s) => s.recipientsStatusFilter,
)
export const selectWhatsappMarketingRetryingRecipientId = createSelector(
  [selectSlice],
  (s) => s.retryingRecipientId,
)
export const selectWhatsappMarketingCancelLoading = createSelector(
  [selectSlice],
  (s) => s.cancelLoading,
)
export const selectWhatsappMarketingAudiencePreview = createSelector(
  [selectSlice],
  (s) => s.audiencePreview,
)
export const selectWhatsappMarketingAudiencePreviewLoading = createSelector(
  [selectSlice],
  (s) => s.audiencePreviewLoading,
)
export const selectWhatsappMarketingAudiencePreviewError = createSelector(
  [selectSlice],
  (s) => s.audiencePreviewError,
)
export const selectWhatsappMarketingCreateStatus = createSelector(
  [selectSlice],
  (s) => s.createStatus,
)
export const selectWhatsappMarketingCreateError = createSelector(
  [selectSlice],
  (s) => s.createError,
)
export const selectWhatsappMarketingLastCreatedCampaignId = createSelector(
  [selectSlice],
  (s) => s.lastCreatedCampaignId,
)

export default whatsappMarketingSlice.reducer
