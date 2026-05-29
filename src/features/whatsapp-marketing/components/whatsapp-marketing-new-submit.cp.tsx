import { useEffect } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Button, Stack } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { buildMarketingAudienceFilterBody } from "../utils/build-marketing-audience-filter"
import {
  createAndLaunchWhatsappMarketingCampaignThunk,
  setWhatsappMarketingNewFieldErrorsAct,
} from "../slice/whatsapp-marketing.slice"
import {
  selectWhatsappMarketingAudiencePreview,
  selectWhatsappMarketingAudiencePreviewLoading,
  selectWhatsappMarketingCreateStatus,
  selectWhatsappMarketingLastCreatedCampaignId,
} from "../slice/whatsapp-marketing.selectors"
import { selectWhatsappMarketingNewFormSnapshot } from "../slice/whatsapp-marketing-new.selectors"
import {
  hasWhatsappMarketingCampaignErrors,
  validateWhatsappMarketingCampaignForm,
} from "../utils/validate-whatsapp-marketing-campaign"

export default function WhatsappMarketingNewSubmitCP() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const form = useAppSelector(selectWhatsappMarketingNewFormSnapshot)
  const audiencePreview = useAppSelector(selectWhatsappMarketingAudiencePreview)
  const previewLoading = useAppSelector(selectWhatsappMarketingAudiencePreviewLoading)
  const previewTotal = audiencePreview?.total ?? null
  const createStatus = useAppSelector(selectWhatsappMarketingCreateStatus)
  const lastCreatedCampaignId = useAppSelector(selectWhatsappMarketingLastCreatedCampaignId)
  const submitting = createStatus === "submitting"

  useEffect(() => {
    if (createStatus === "success" && lastCreatedCampaignId != null) {
      navigate(`/dashboard/whatsapp-marketing/${lastCreatedCampaignId}`)
    }
  }, [createStatus, lastCreatedCampaignId, navigate])

  const validation = validateWhatsappMarketingCampaignForm({
    name: form.name,
    templateName: form.templateName,
    templateLanguage: form.templateLanguage,
    templateParamsText: form.templateParamsText,
    batchSize: form.batchSize,
    batchDelayMs: form.batchDelayMs,
    campaignType: form.campaignType,
    audienceMode: form.audienceMode,
    manualCustomerCount: form.manualCustomerIds.length,
    previewTotal,
    previewLoading,
  })
  const canSubmit = !hasWhatsappMarketingCampaignErrors(validation.errors)

  const handleCreateAndLaunch = () => {
    const { errors, templateComponents } = validation
    dispatch(setWhatsappMarketingNewFieldErrorsAct(errors))
    if (hasWhatsappMarketingCampaignErrors(errors)) {
      return
    }
    void dispatch(
      createAndLaunchWhatsappMarketingCampaignThunk({
        name: form.name.trim(),
        templateName: form.templateName.trim(),
        templateLanguage: form.templateLanguage.trim() || "es",
        templateComponents,
        audienceMode: form.audienceMode,
        audienceFilter:
          form.audienceMode !== "manual"
            ? buildMarketingAudienceFilterBody(form.applied, [...form.selectedStepIds])
            : undefined,
        manualCustomerIds:
          form.audienceMode !== "filter" ? [...form.manualCustomerIds] : undefined,
        campaignType: form.campaignType,
        preserveAssigneeCustomerStepIds:
          form.campaignType === "recovery_potential" ? [...form.preserveStepIds] : undefined,
        replyAdvanceToCustomerStepId:
          form.campaignType === "recovery_potential" && form.advanceStepId.trim() !== ""
            ? form.advanceStepId
            : undefined,
        batchSize: form.batchSize,
        batchDelayMs: form.batchDelayMs,
      }),
    )
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        onClick={handleCreateAndLaunch}
        disabled={submitting || !canSubmit}
        sx={{ cursor: "pointer" }}
      >
        Crear y lanzar
      </Button>
      <Button component={RouterLink} to="/dashboard/whatsapp-marketing" sx={{ cursor: "pointer" }}>
        Cancelar
      </Button>
    </Stack>
  )
}
