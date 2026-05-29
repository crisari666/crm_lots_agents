import { useCallback, useEffect, useMemo, useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import CustomerListFiltersCP from "../../customer-v2/components/customer-list-filters.cp"
import CustomerAutocompleteAsyncCP from "../../customer-v2/components/customer-autocomplete-async.cp"
import { emptyFilters, type FilterFormState } from "../../customer-v2/types/filter-form.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { listCustomerStepsV2 } from "../../steps-v2/services/customer-steps-v2.service"
import type { CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"
import type { CustomerAutocompleteItem } from "../../customer-v2/services/customers-ms.service"
import { buildMarketingAudienceFilterBody } from "../utils/build-marketing-audience-filter"
import {
  hasWhatsappMarketingCampaignErrors,
  validateWhatsappMarketingCampaignForm,
  type WhatsappMarketingCampaignFieldErrors,
} from "../utils/validate-whatsapp-marketing-campaign"
import {
  createAndLaunchWhatsappMarketingCampaignThunk,
  previewWhatsappMarketingAudienceThunk,
  resetWhatsappMarketingAudiencePreviewAct,
  resetWhatsappMarketingCreateAct,
  selectWhatsappMarketingAudiencePreview,
  selectWhatsappMarketingAudiencePreviewError,
  selectWhatsappMarketingAudiencePreviewLoading,
  selectWhatsappMarketingCreateError,
  selectWhatsappMarketingCreateStatus,
  selectWhatsappMarketingLastCreatedCampaignId,
} from "../slice/whatsapp-marketing.slice"
import type {
  WhatsappMarketingAudienceMode,
  WhatsappMarketingCampaignType,
} from "../services/customers-ms-whatsapp-marketing.types"

export default function WhatsappMarketingNewPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  const [name, setName] = useState("")
  const [templateName, setTemplateName] = useState("")
  const [templateLanguage, setTemplateLanguage] = useState("es")
  const [templateParamsText, setTemplateParamsText] = useState("")
  const [batchSize, setBatchSize] = useState(5)
  const [batchDelayMs, setBatchDelayMs] = useState(200)
  const [campaignType, setCampaignType] = useState<WhatsappMarketingCampaignType>("standard")
  const [audienceMode, setAudienceMode] = useState<WhatsappMarketingAudienceMode>("filter")
  const [draft, setDraft] = useState<FilterFormState>(emptyFilters())
  const [applied, setApplied] = useState<FilterFormState>(emptyFilters())
  const [steps, setSteps] = useState<CustomerStepV2[]>([])
  const [selectedStepIds, setSelectedStepIds] = useState<string[]>([])
  const [preserveStepIds, setPreserveStepIds] = useState<string[]>([])
  const [advanceStepId, setAdvanceStepId] = useState("")
  const [manualPicks, setManualPicks] = useState<CustomerAutocompleteItem[]>([])
  const [picker, setPicker] = useState<CustomerAutocompleteItem | null>(null)
  const audiencePreview = useAppSelector(selectWhatsappMarketingAudiencePreview)
  const previewLoading = useAppSelector(selectWhatsappMarketingAudiencePreviewLoading)
  const previewError = useAppSelector(selectWhatsappMarketingAudiencePreviewError)
  const createStatus = useAppSelector(selectWhatsappMarketingCreateStatus)
  const createError = useAppSelector(selectWhatsappMarketingCreateError)
  const lastCreatedCampaignId = useAppSelector(selectWhatsappMarketingLastCreatedCampaignId)
  const previewTotal = audiencePreview?.total ?? null
  const excludedNoPhone = audiencePreview?.excludedNoPhone ?? 0
  const submitting = createStatus === "submitting"
  const error = createError ?? previewError ?? ""
  const [fieldErrors, setFieldErrors] = useState<WhatsappMarketingCampaignFieldErrors>({})

  useEffect(() => {
    dispatch(resetWhatsappMarketingCreateAct())
    dispatch(resetWhatsappMarketingAudiencePreviewAct())
  }, [dispatch])
  useEffect(() => {
    if (!gotUsers) void dispatch(fetchUsersThunk({ enable: true }))
  }, [dispatch, gotUsers])
  useEffect(() => {
    if (createStatus === "success" && lastCreatedCampaignId != null) {
      navigate(`/dashboard/whatsapp-marketing/${lastCreatedCampaignId}`)
    }
  }, [createStatus, lastCreatedCampaignId, navigate])

  useEffect(() => {
    void listCustomerStepsV2().then((list) => {
      if (Array.isArray(list)) setSteps(list)
    })
  }, [])

  const manualCustomerIds = useMemo(
    () => manualPicks.map((p) => p.id),
    [manualPicks]
  )

  const runPreview = useCallback(() => {
    void dispatch(
      previewWhatsappMarketingAudienceThunk({
        audienceMode,
        ...(audienceMode !== "manual"
          ? { audienceFilter: buildMarketingAudienceFilterBody(applied, selectedStepIds) }
          : {}),
        ...(audienceMode !== "filter" ? { manualCustomerIds } : {}),
      }),
    )
  }, [dispatch, audienceMode, applied, selectedStepIds, manualCustomerIds])

  useEffect(() => {
    const timer = window.setTimeout(runPreview, 400)
    return () => window.clearTimeout(timer)
  }, [runPreview])

  const handleAddManual = () => {
    if (picker == null) return
    if (manualPicks.some((p) => p.id === picker.id)) return
    setManualPicks((prev) => [...prev, picker])
    setPicker(null)
    clearFieldError("audience")
    clearFieldError("preview")
  }

  const validation = useMemo(
    () =>
      validateWhatsappMarketingCampaignForm({
        name,
        templateName,
        templateLanguage,
        templateParamsText,
        batchSize,
        batchDelayMs,
        campaignType,
        audienceMode,
        manualCustomerCount: manualCustomerIds.length,
        previewTotal,
        previewLoading,
      }),
    [
      name,
      templateName,
      templateLanguage,
      templateParamsText,
      batchSize,
      batchDelayMs,
      campaignType,
      audienceMode,
      manualCustomerIds.length,
      previewTotal,
      previewLoading,
    ]
  )

  const canSubmit = !hasWhatsappMarketingCampaignErrors(validation.errors)

  const clearFieldError = (key: keyof WhatsappMarketingCampaignFieldErrors) => {
    setFieldErrors((prev) => {
      if (prev[key] === undefined) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleCreateAndLaunch = () => {
    const { errors, templateComponents } = validation
    setFieldErrors(errors)
    if (hasWhatsappMarketingCampaignErrors(errors)) {
      return
    }
    void dispatch(
      createAndLaunchWhatsappMarketingCampaignThunk({
        name: name.trim(),
        templateName: templateName.trim(),
        templateLanguage: templateLanguage.trim() || "es",
        templateComponents,
        audienceMode,
        audienceFilter:
          audienceMode !== "manual"
            ? buildMarketingAudienceFilterBody(applied, selectedStepIds)
            : undefined,
        manualCustomerIds: audienceMode !== "filter" ? manualCustomerIds : undefined,
        campaignType,
        preserveAssigneeCustomerStepIds:
          campaignType === "recovery_potential" ? preserveStepIds : undefined,
        replyAdvanceToCustomerStepId:
          campaignType === "recovery_potential" && advanceStepId.trim() !== ""
            ? advanceStepId
            : undefined,
        batchSize,
        batchDelayMs,
      }),
    )
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Nueva campaña WhatsApp
      </Typography>
      {error !== "" ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Configuración
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Nombre de campaña"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearFieldError("name")
              }}
              error={fieldErrors.name !== undefined}
              helperText={fieldErrors.name}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Nombre plantilla WhatsApp"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value)
                clearFieldError("templateName")
              }}
              error={fieldErrors.templateName !== undefined}
              helperText={fieldErrors.templateName}
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Idioma"
              value={templateLanguage}
              onChange={(e) => {
                setTemplateLanguage(e.target.value)
                clearFieldError("templateLanguage")
              }}
              error={fieldErrors.templateLanguage !== undefined}
              helperText={fieldErrors.templateLanguage ?? "Ej. es, en_US"}
              size="small"
              sx={{ maxWidth: 160 }}
            />
            <TextField
              label="Parámetros plantilla (JSON components, opcional)"
              value={templateParamsText}
              onChange={(e) => {
                setTemplateParamsText(e.target.value)
                clearFieldError("templateParamsText")
              }}
              error={fieldErrors.templateParamsText !== undefined}
              helperText={fieldErrors.templateParamsText}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
            <FormControl size="small" sx={{ maxWidth: 280 }}>
              <InputLabel>Tipo de campaña</InputLabel>
              <Select
                label="Tipo de campaña"
                value={campaignType}
                onChange={(e: SelectChangeEvent) =>
                  setCampaignType(e.target.value as WhatsappMarketingCampaignType)
                }
              >
                <MenuItem value="standard">Estándar</MenuItem>
                <MenuItem value="recovery_potential">Recuperación potenciales</MenuItem>
              </Select>
            </FormControl>
            {campaignType === "recovery_potential" ? (
              <Stack spacing={1}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Preservar asignado en steps</InputLabel>
                  <Select
                    multiple
                    label="Preservar asignado en steps"
                    value={preserveStepIds}
                    onChange={(e) => setPreserveStepIds(e.target.value as string[])}
                    renderValue={(selected) =>
                      selected
                        .map((id) => steps.find((s) => s.id === id)?.name ?? id)
                        .join(", ")
                    }
                  >
                    {steps.map((step) => (
                      <MenuItem key={step.id} value={step.id}>
                        {step.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>Avanzar step al responder (opcional)</InputLabel>
                  <Select
                    label="Avanzar step al responder (opcional)"
                    value={advanceStepId}
                    onChange={(e) => setAdvanceStepId(e.target.value)}
                  >
                    <MenuItem value="">Ninguno</MenuItem>
                    {steps.map((step) => (
                      <MenuItem key={step.id} value={step.id}>
                        {step.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            ) : null}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Cantidad por lote"
                type="number"
                value={batchSize}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10)
                  setBatchSize(Number.isNaN(next) ? 0 : next)
                  clearFieldError("batchSize")
                }}
                error={fieldErrors.batchSize !== undefined}
                helperText={fieldErrors.batchSize ?? "1–50 mensajes por lote"}
                size="small"
                inputProps={{ min: 1, max: 50 }}
                sx={{ maxWidth: 180 }}
                required
              />
              <TextField
                label="Pausa entre lotes (ms)"
                type="number"
                value={batchDelayMs}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10)
                  setBatchDelayMs(Number.isNaN(next) ? 0 : next)
                  clearFieldError("batchDelayMs")
                }}
                error={fieldErrors.batchDelayMs !== undefined}
                helperText={fieldErrors.batchDelayMs ?? "0–5000 ms entre lotes"}
                size="small"
                inputProps={{ min: 0, max: 5000 }}
                sx={{ maxWidth: 200 }}
                required
              />
            </Stack>
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Audiencia
          </Typography>
          <FormControl>
            <RadioGroup
              row
              value={audienceMode}
              onChange={(e) => {
                setAudienceMode(e.target.value as WhatsappMarketingAudienceMode)
                clearFieldError("audience")
                clearFieldError("preview")
              }}
            >
              <FormControlLabel value="filter" control={<Radio />} label="Segmento" />
              <FormControlLabel value="manual" control={<Radio />} label="Búsqueda manual" />
              <FormControlLabel value="combined" control={<Radio />} label="Ambos" />
            </RadioGroup>
          </FormControl>
          {audienceMode !== "manual" ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <CustomerListFiltersCP
                draft={draft}
                setDraft={setDraft}
                loading={previewLoading}
                onSearch={() => setApplied({ ...draft })}
                users={users}
                steps={steps}
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Steps (multi)</InputLabel>
                <Select
                  multiple
                  label="Steps (multi)"
                  value={selectedStepIds}
                  onChange={(e) => setSelectedStepIds(e.target.value as string[])}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? "Todos los steps"
                      : selected.map((id) => steps.find((s) => s.id === id)?.name ?? id).join(", ")
                  }
                >
                  {steps.map((step) => (
                    <MenuItem key={step.id} value={step.id}>
                      {step.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          ) : null}
          {fieldErrors.audience !== undefined ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {fieldErrors.audience}
            </Alert>
          ) : null}
          {audienceMode !== "filter" ? (
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CustomerAutocompleteAsyncCP value={picker} onChange={setPicker} label="Buscar cliente" />
                <Button variant="outlined" onClick={handleAddManual} disabled={picker == null} sx={{ cursor: "pointer" }}>
                  Agregar
                </Button>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {manualPicks.map((pick) => (
                  <Chip
                    key={pick.id}
                    label={`${pick.name ?? ""} ${pick.lastName ?? ""}`.trim() || pick.phone}
                    onDelete={() => setManualPicks((prev) => prev.filter((p) => p.id !== pick.id))}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            {previewLoading ? "…" : previewTotal ?? "—"}
          </Typography>
          <Typography color="text.secondary">
            destinatarios con teléfono válido · plantilla {templateName || "(sin nombre)"}
          </Typography>
          {excludedNoPhone > 0 ? (
            <Typography color="warning.main" variant="body2">
              {excludedNoPhone} sin teléfono se excluyen
            </Typography>
          ) : null}
          {fieldErrors.preview !== undefined ? (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {fieldErrors.preview}
            </Typography>
          ) : null}
        </Paper>
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
    </Box>
  )
}
