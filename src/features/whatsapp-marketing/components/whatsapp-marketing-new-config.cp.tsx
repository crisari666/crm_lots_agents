import CustomerStepAutocompleteCP from "../../customer-v2/components/customer-step-autocomplete.cp"
import CustomerStepMultiAutocompleteCP from "../../customer-v2/components/customer-step-multi-autocomplete.cp"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { WhatsappMarketingCampaignType } from "../services/customers-ms-whatsapp-marketing.types"
import {
  clearWhatsappMarketingNewFieldErrorAct,
  patchWhatsappMarketingNewCampaignFormAct,
} from "../slice/whatsapp-marketing.slice"
import { selectWhatsappMarketingNewCampaignConfigFields } from "../slice/whatsapp-marketing-new.selectors"

export default function WhatsappMarketingNewConfigCP() {
  const dispatch = useAppDispatch()
  const {
    name,
    templateName,
    templateLanguage,
    templateParamsText,
    batchSize,
    batchDelayMs,
    campaignType,
    preserveStepIds,
    advanceStepId,
    steps,
    fieldErrors,
  } = useAppSelector(selectWhatsappMarketingNewCampaignConfigFields)

  const clearFieldError = (key: keyof typeof fieldErrors) => {
    dispatch(clearWhatsappMarketingNewFieldErrorAct(key))
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Configuración
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Nombre de campaña"
          value={name}
          onChange={(e) => {
            dispatch(patchWhatsappMarketingNewCampaignFormAct({ name: e.target.value }))
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
            dispatch(patchWhatsappMarketingNewCampaignFormAct({ templateName: e.target.value }))
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
            dispatch(patchWhatsappMarketingNewCampaignFormAct({ templateLanguage: e.target.value }))
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
            dispatch(patchWhatsappMarketingNewCampaignFormAct({ templateParamsText: e.target.value }))
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
              dispatch(
                patchWhatsappMarketingNewCampaignFormAct({
                  campaignType: e.target.value as WhatsappMarketingCampaignType,
                }),
              )
            }
          >
            <MenuItem value="standard">Estándar</MenuItem>
            <MenuItem value="recovery_potential">Recuperación potenciales</MenuItem>
          </Select>
        </FormControl>
        {campaignType === "recovery_potential" ? (
          <Stack spacing={1}>
            <CustomerStepMultiAutocompleteCP
              steps={steps}
              value={preserveStepIds}
              onChange={(stepIds) =>
                dispatch(patchWhatsappMarketingNewCampaignFormAct({ preserveStepIds: stepIds }))
              }
              label="Preservar asignado en steps"
              emptyHint="Ninguno — buscar step"
            />
            <CustomerStepAutocompleteCP
              steps={steps}
              value={advanceStepId}
              onChange={(stepId) =>
                dispatch(patchWhatsappMarketingNewCampaignFormAct({ advanceStepId: stepId }))
              }
              label="Avanzar step al responder (opcional)"
            />
          </Stack>
        ) : null}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Cantidad por lote"
            type="number"
            value={batchSize}
            onChange={(e) => {
              const raw = e.target.value.trim()
              if (raw === "") {
                return
              }
              const next = Number.parseInt(raw, 10)
              if (Number.isNaN(next)) {
                return
              }
              dispatch(patchWhatsappMarketingNewCampaignFormAct({ batchSize: next }))
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
              const raw = e.target.value.trim()
              if (raw === "") {
                return
              }
              const next = Number.parseInt(raw, 10)
              if (Number.isNaN(next)) {
                return
              }
              dispatch(patchWhatsappMarketingNewCampaignFormAct({ batchDelayMs: next }))
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
  )
}
