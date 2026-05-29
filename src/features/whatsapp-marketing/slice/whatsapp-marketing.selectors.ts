import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type { WhatsappMarketingState } from "./whatsapp-marketing.state"

export const selectWhatsappMarketingSlice = (state: RootState): WhatsappMarketingState =>
  state.whatsappMarketing

export const selectWhatsappMarketingListItems = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.listItems,
)

export const selectWhatsappMarketingListLoading = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.listLoading,
)

export const selectWhatsappMarketingListError = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.listError,
)

export const selectWhatsappMarketingDetailCampaign = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.detailCampaign,
)

export const selectWhatsappMarketingDetailLoading = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.detailLoading,
)

export const selectWhatsappMarketingDetailError = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.detailError,
)

export const selectWhatsappMarketingRecipients = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.recipients,
)

export const selectWhatsappMarketingRecipientsStatusFilter = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.recipientsStatusFilter,
)

export const selectWhatsappMarketingRetryingRecipientId = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.retryingRecipientId,
)

export const selectWhatsappMarketingCancelLoading = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.cancelLoading,
)

export const selectWhatsappMarketingAudiencePreview = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.audiencePreview,
)

export const selectWhatsappMarketingAudiencePreviewLoading = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.audiencePreviewLoading,
)

export const selectWhatsappMarketingAudiencePreviewError = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.audiencePreviewError,
)

export const selectWhatsappMarketingCreateStatus = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.createStatus,
)

export const selectWhatsappMarketingCreateError = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.createError,
)

export const selectWhatsappMarketingLastCreatedCampaignId = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.lastCreatedCampaignId,
)

export const selectWhatsappMarketingNewCampaignForm = createSelector(
  [selectWhatsappMarketingSlice],
  (s) => s.newCampaignForm,
)
