import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useEffect, useState } from "react"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type {
  JobCampaignAdminItem,
  JobCampaignCaptureField,
} from "../types/job-campaign.types"
import {
  DEFAULT_CV_REQUEST_MESSAGE,
  DEFAULT_JOB_CAMPAIGN_CAPTURE_FIELDS,
  DEFAULT_JOB_CAMPAIGN_REQUIREMENTS,
  DEFAULT_VIDEO_RECEIVED_MESSAGE,
  DEFAULT_VIDEO_REQUEST_MESSAGE,
  DEFAULT_VOICE_RECRUITING_AGENT_PROMPT,
  DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
  DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
  DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT,
} from "../utils/job-campaign-defaults"

type ScreeningCopy = {
  readonly requirements: string
  readonly cvRequestMessage: string
  readonly videoRequestMessage: string
  readonly videoReceivedMessage: string
}

type SetupSubmitPayload = ScreeningCopy & {
  readonly name: string
  readonly description: string
  readonly voiceAgentPrompt: string
  readonly whatsappAgentPrompt: string
  readonly captureFields: readonly JobCampaignCaptureField[]
  readonly whatsappTemplateName: string
  readonly whatsappTemplateLanguage: string
}

const DEFAULT_SCREENING_COPY: ScreeningCopy = {
  requirements: DEFAULT_JOB_CAMPAIGN_REQUIREMENTS,
  cvRequestMessage: DEFAULT_CV_REQUEST_MESSAGE,
  videoRequestMessage: DEFAULT_VIDEO_REQUEST_MESSAGE,
  videoReceivedMessage: DEFAULT_VIDEO_RECEIVED_MESSAGE,
}

const pickText = (value: string | undefined, fallback: string): string =>
  value != null && value.trim().length > 0 ? value : fallback

function buildScreeningCopy(
  source: JobCampaignAdminItem | null,
  requirementsFallback: string,
): ScreeningCopy {
  return {
    requirements: pickText(source?.requirements, requirementsFallback),
    cvRequestMessage: pickText(
      source?.cvRequestMessage,
      DEFAULT_CV_REQUEST_MESSAGE,
    ),
    videoRequestMessage: pickText(
      source?.videoRequestMessage,
      DEFAULT_VIDEO_REQUEST_MESSAGE,
    ),
    videoReceivedMessage: pickText(
      source?.videoReceivedMessage,
      DEFAULT_VIDEO_RECEIVED_MESSAGE,
    ),
  }
}

type Props = {
  readonly open: boolean
  readonly mode: "create" | "edit"
  readonly campaign: JobCampaignAdminItem | null
  /** Newest campaign used to seed template fields on create. */
  readonly lastCampaign: JobCampaignAdminItem | null
  readonly saving: boolean
  readonly onClose: () => void
  readonly onSubmitCreate: (
    input: SetupSubmitPayload & { readonly activate: boolean },
  ) => void
  readonly onSubmitUpdate: (input: SetupSubmitPayload) => void
}

export function JobCampaignSetupDialogCp(props: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [voicePrompt, setVoicePrompt] = useState(
    DEFAULT_VOICE_RECRUITING_AGENT_PROMPT,
  )
  const [whatsappPrompt, setWhatsappPrompt] = useState(
    DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT,
  )
  const [templateName, setTemplateName] = useState(
    DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
  )
  const [templateLanguage, setTemplateLanguage] = useState(
    DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
  )
  const [fields, setFields] = useState<JobCampaignCaptureField[]>([
    ...DEFAULT_JOB_CAMPAIGN_CAPTURE_FIELDS,
  ])
  const [activate, setActivate] = useState(false)
  const [screeningCopy, setScreeningCopy] = useState<ScreeningCopy>(
    DEFAULT_SCREENING_COPY,
  )

  const updateScreeningCopy = (key: keyof ScreeningCopy, value: string): void => {
    setScreeningCopy((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (!props.open) return
    if (props.mode === "edit" && props.campaign != null) {
      setName(props.campaign.name)
      setDescription(props.campaign.description)
      setVoicePrompt(props.campaign.voiceAgentPrompt)
      setWhatsappPrompt(props.campaign.whatsappAgentPrompt)
      setTemplateName(
        props.campaign.whatsappTemplateName.trim().length > 0
          ? props.campaign.whatsappTemplateName
          : DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
      )
      setTemplateLanguage(
        props.campaign.whatsappTemplateLanguage.trim().length > 0
          ? props.campaign.whatsappTemplateLanguage
          : DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
      )
      setFields([...props.campaign.captureFields])
      setScreeningCopy(buildScreeningCopy(props.campaign, ""))
      return
    }
    const seedFromLast = props.lastCampaign
    setName("")
    setDescription("")
    setVoicePrompt(DEFAULT_VOICE_RECRUITING_AGENT_PROMPT)
    setWhatsappPrompt(DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT)
    setTemplateName(
      seedFromLast != null &&
        seedFromLast.whatsappTemplateName.trim().length > 0
        ? seedFromLast.whatsappTemplateName
        : DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
    )
    setTemplateLanguage(
      seedFromLast != null &&
        seedFromLast.whatsappTemplateLanguage.trim().length > 0
        ? seedFromLast.whatsappTemplateLanguage
        : DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
    )
    setFields([...DEFAULT_JOB_CAMPAIGN_CAPTURE_FIELDS])
    setScreeningCopy(
      buildScreeningCopy(seedFromLast, DEFAULT_JOB_CAMPAIGN_REQUIREMENTS),
    )
    setActivate(false)
  }, [props.open, props.mode, props.campaign, props.lastCampaign])

  const handleAddField = (): void => {
    setFields((prev) => [
      ...prev,
      {
        key: `field_${prev.length + 1}`,
        label: "Nuevo campo",
        required: false,
        order: prev.length,
      },
    ])
  }

  const handleSubmit = (): void => {
    if (name.trim().length === 0) return
    const payload: SetupSubmitPayload = {
      name: name.trim(),
      description: description.trim(),
      voiceAgentPrompt: voicePrompt,
      whatsappAgentPrompt: whatsappPrompt,
      captureFields: fields,
      whatsappTemplateName:
        templateName.trim().length > 0
          ? templateName.trim()
          : DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
      whatsappTemplateLanguage:
        templateLanguage.trim().length > 0
          ? templateLanguage.trim()
          : DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
      requirements: screeningCopy.requirements.trim(),
      cvRequestMessage: screeningCopy.cvRequestMessage.trim(),
      videoRequestMessage: screeningCopy.videoRequestMessage.trim(),
      videoReceivedMessage: screeningCopy.videoReceivedMessage.trim(),
    }
    if (props.mode === "create") {
      props.onSubmitCreate({ ...payload, activate })
      return
    }
    props.onSubmitUpdate(payload)
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {props.mode === "create" ? s.newCampaign : s.setupTitle}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label={s.fieldName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={s.fieldDescription}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label={s.fieldVoicePrompt}
            value={voicePrompt}
            onChange={(e) => setVoicePrompt(e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />
          <TextField
            label={s.fieldWhatsappPrompt}
            value={whatsappPrompt}
            onChange={(e) => setWhatsappPrompt(e.target.value)}
            fullWidth
            multiline
            minRows={10}
          />
          <TextField
            label={s.fieldWhatsappTemplateName}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
            helperText={s.whatsappTemplateHint}
          />
          <TextField
            label={s.fieldWhatsappTemplateLanguage}
            value={templateLanguage}
            onChange={(e) => setTemplateLanguage(e.target.value)}
            fullWidth
            placeholder={DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE}
          />
          <Typography variant="subtitle2" sx={{ pt: 1 }}>
            {s.screeningTitle}
          </Typography>
          <TextField
            label={s.fieldRequirements}
            value={screeningCopy.requirements}
            onChange={(e) => updateScreeningCopy("requirements", e.target.value)}
            fullWidth
            multiline
            minRows={3}
            helperText={s.requirementsHint}
          />
          <TextField
            label={s.fieldCvRequestMessage}
            value={screeningCopy.cvRequestMessage}
            onChange={(e) =>
              updateScreeningCopy("cvRequestMessage", e.target.value)
            }
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label={s.fieldVideoRequestMessage}
            value={screeningCopy.videoRequestMessage}
            onChange={(e) =>
              updateScreeningCopy("videoRequestMessage", e.target.value)
            }
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label={s.fieldVideoReceivedMessage}
            value={screeningCopy.videoReceivedMessage}
            onChange={(e) =>
              updateScreeningCopy("videoReceivedMessage", e.target.value)
            }
            fullWidth
            multiline
            minRows={2}
          />
          <Typography variant="caption" color="text.secondary">
            {s.meetHint}
          </Typography>
          <Typography variant="subtitle2">{s.captureFieldsTitle}</Typography>
          {fields.map((field, index) => (
            <Stack
              key={`${field.key}-${index}`}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                label={s.fieldKey}
                size="small"
                value={field.key}
                onChange={(e) => {
                  const next = [...fields]
                  next[index] = { ...field, key: e.target.value }
                  setFields(next)
                }}
              />
              <TextField
                label={s.fieldLabel}
                size="small"
                value={field.label}
                onChange={(e) => {
                  const next = [...fields]
                  next[index] = { ...field, label: e.target.value }
                  setFields(next)
                }}
                sx={{ flex: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required}
                    onChange={(e) => {
                      const next = [...fields]
                      next[index] = { ...field, required: e.target.checked }
                      setFields(next)
                    }}
                  />
                }
                label={s.fieldRequired}
              />
              <IconButton
                aria-label="remove"
                onClick={() =>
                  setFields(fields.filter((_, i) => i !== index))
                }
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Box>
            <Button onClick={handleAddField}>{s.addField}</Button>
          </Box>
          {props.mode === "create" ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={activate}
                  onChange={(e) => setActivate(e.target.checked)}
                />
              }
              label={s.activateOnCreate}
            />
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          disabled={props.saving || name.trim().length === 0}
          onClick={handleSubmit}
        >
          {props.mode === "create" ? s.create : s.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
