import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type { AudiencePreviewBody } from "../services/customers-ms-whatsapp-marketing.types"
import type { WhatsappMarketingNewFormSnapshot } from "../types/whatsapp-marketing-new-form.type"
import { buildMarketingAudienceFilterBody } from "../utils/build-marketing-audience-filter"
import {
  selectWhatsappMarketingAudiencePreviewLoading,
  selectWhatsappMarketingNewCampaignForm,
} from "./whatsapp-marketing.selectors"

const selectNewCampaignAudienceMode = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.audienceMode

const selectNewCampaignDraft = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.draft

const selectNewCampaignApplied = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.applied

const selectNewCampaignSelectedStepIds = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.selectedStepIds

const selectNewCampaignManualPicks = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.manualPicks

const selectNewCampaignPicker = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.picker

const selectNewCampaignSteps = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.steps

const selectNewCampaignFieldErrors = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.fieldErrors

const selectNewCampaignName = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.name

const selectNewCampaignTemplateName = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.templateName

const selectNewCampaignTemplateLanguage = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.templateLanguage

const selectNewCampaignTemplateParamsText = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.templateParamsText

const selectNewCampaignTemplateHeaderMediaId = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.templateHeaderMediaId

const selectNewCampaignTemplateHeaderMediaType = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.templateHeaderMediaType

const selectNewCampaignBatchSize = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.batchSize

const selectNewCampaignBatchDelayMs = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.batchDelayMs

const selectNewCampaignType = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.campaignType

const selectNewCampaignPreserveStepIds = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.preserveStepIds

const selectNewCampaignAdvanceStepId = (state: RootState) =>
  state.whatsappMarketing.newCampaignForm.advanceStepId

export const selectWhatsappMarketingNewFormSnapshot = createSelector(
  [selectWhatsappMarketingNewCampaignForm],
  (form): WhatsappMarketingNewFormSnapshot => ({
    name: form.name,
    templateName: form.templateName,
    templateLanguage: form.templateLanguage,
    templateParamsText: form.templateParamsText ?? "",
    templateHeaderMediaId: form.templateHeaderMediaId ?? "",
    templateHeaderMediaType: form.templateHeaderMediaType ?? "image",
    batchSize: form.batchSize,
    batchDelayMs: form.batchDelayMs,
    campaignType: form.campaignType,
    audienceMode: form.audienceMode,
    applied: form.applied,
    selectedStepIds: form.selectedStepIds,
    manualCustomerIds: form.manualPicks.map((pick) => pick.id),
    preserveStepIds: form.preserveStepIds,
    advanceStepId: form.advanceStepId,
  }),
)

export const selectWhatsappMarketingNewCampaignConfigFields = createSelector(
  [
    selectNewCampaignName,
    selectNewCampaignTemplateName,
    selectNewCampaignTemplateLanguage,
    selectNewCampaignTemplateParamsText,
    selectNewCampaignTemplateHeaderMediaId,
    selectNewCampaignTemplateHeaderMediaType,
    selectNewCampaignBatchSize,
    selectNewCampaignBatchDelayMs,
    selectNewCampaignType,
    selectNewCampaignPreserveStepIds,
    selectNewCampaignAdvanceStepId,
    selectNewCampaignSteps,
    selectNewCampaignFieldErrors,
  ],
  (
    name,
    templateName,
    templateLanguage,
    templateParamsText,
    templateHeaderMediaId,
    templateHeaderMediaType,
    batchSize,
    batchDelayMs,
    campaignType,
    preserveStepIds,
    advanceStepId,
    steps,
    fieldErrors,
  ) => ({
    name,
    templateName,
    templateLanguage,
    templateParamsText: templateParamsText ?? "",
    templateHeaderMediaId: templateHeaderMediaId ?? "",
    templateHeaderMediaType: templateHeaderMediaType ?? "image",
    batchSize,
    batchDelayMs,
    campaignType,
    preserveStepIds,
    advanceStepId,
    steps,
    fieldErrors,
  }),
)

export const selectWhatsappMarketingNewCampaignAudienceFields = createSelector(
  [
    selectNewCampaignAudienceMode,
    selectNewCampaignDraft,
    selectNewCampaignApplied,
    selectNewCampaignSelectedStepIds,
    selectNewCampaignManualPicks,
    selectNewCampaignPicker,
    selectNewCampaignSteps,
    selectNewCampaignFieldErrors,
  ],
  (audienceMode, draft, applied, selectedStepIds, manualPicks, picker, steps, fieldErrors) => ({
    audienceMode,
    draft,
    applied,
    selectedStepIds,
    manualPicks,
    picker,
    steps,
    fieldErrors,
  }),
)

export const selectWhatsappMarketingNewCampaignPreviewFields = createSelector(
  [selectNewCampaignTemplateName, selectNewCampaignFieldErrors],
  (templateName, fieldErrors) => ({
    templateName,
    previewFieldError: fieldErrors.preview,
  }),
)

export const selectWhatsappMarketingAudiencePreviewBody = createSelector(
  [
    selectNewCampaignAudienceMode,
    selectNewCampaignApplied,
    selectNewCampaignSelectedStepIds,
    selectNewCampaignManualPicks,
  ],
  (audienceMode, applied, selectedStepIds, manualPicks): AudiencePreviewBody => {
    const manualCustomerIds = manualPicks.map((pick) => pick.id).sort()
    return {
      audienceMode,
      ...(audienceMode !== "manual"
        ? { audienceFilter: buildMarketingAudienceFilterBody(applied, selectedStepIds) }
        : {}),
      ...(audienceMode !== "filter" ? { manualCustomerIds } : {}),
    }
  },
)

export const selectWhatsappMarketingAudiencePreviewKey = createSelector(
  [selectWhatsappMarketingAudiencePreviewBody],
  (body) => JSON.stringify(body),
)

export const selectWhatsappMarketingAudiencePreviewIsStale = createSelector(
  [
    selectWhatsappMarketingAudiencePreviewKey,
    (state: RootState) => state.whatsappMarketing.audiencePreviewRequestKey,
    selectWhatsappMarketingAudiencePreviewLoading,
  ],
  (currentKey, lastRequestKey, loading) => loading || lastRequestKey !== currentKey,
)
