import { useEffect } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Alert, Button, Stack, Typography } from "@mui/material"
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
import {
  selectWhatsappMarketingAudiencePreviewIsStale,
  selectWhatsappMarketingNewFormSnapshot,
} from "../slice/whatsapp-marketing-new.selectors"
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
  const previewIsStale = useAppSelector(selectWhatsappMarketingAudiencePreviewIsStale)
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
    templateHeaderMediaId: form.templateHeaderMediaId,
    templateHeaderMediaType: form.templateHeaderMediaType,
    batchSize: form.batchSize,
    batchDelayMs: form.batchDelayMs,
    campaignType: form.campaignType,
    audienceMode: form.audienceMode,
    manualCustomerCount: form.manualCustomerIds.length,
    previewTotal,
    previewLoading,
    previewIsStale,
  })
  const canSubmit = !hasWhatsappMarketingCampaignErrors(validation.errors)
  const blockingMessages = Object.values(validation.errors).filter(
    (message): message is string => message != null && message.length > 0,
  )

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
        templateHeaderMediaId:
          form.templateHeaderMediaId.trim() !== "" ? form.templateHeaderMediaId.trim() : undefined,
        templateHeaderMediaType: form.templateHeaderMediaType,
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
    <Stack spacing={1}>
      {!canSubmit && blockingMessages.length > 0 ? (
        <Alert severity="info" sx={{ alignItems: "flex-start" }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            Completa lo siguiente para habilitar el lanzamiento:
          </Typography>
          {blockingMessages.map((message) => (
            <Typography key={message} variant="body2" component="div">
              • {message}
            </Typography>
          ))}
        </Alert>
      ) : null}
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
    </Stack>
  )
}
