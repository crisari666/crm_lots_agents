import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignCaptureField } from "../../types/job-campaign.types"
import type { JobCampaignSetupStepProps } from "./job-campaign-setup.types"

export function SetupCaptureFieldsStepCp(props: JobCampaignSetupStepProps) {
  const fields = props.form.captureFields
  const updateField = (index: number, patch: Partial<JobCampaignCaptureField>): void => {
    props.onChange({
      captureFields: fields.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    })
  }
  const addField = (): void => {
    props.onChange({
      captureFields: [
        ...fields,
        { key: `field_${fields.length + 1}`, label: "", required: false, order: fields.length },
      ],
    })
  }
  return (
    <Stack spacing={1.5}>
      {props.errors.captureFields != null ? (
        <Alert severity="error" variant="outlined">
          {props.errors.captureFields}
        </Alert>
      ) : null}
      {fields.map((field, index) => (
        <Stack
          key={index}
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <TextField
            label={s.fieldKey}
            size="small"
            value={field.key}
            onChange={(e) => updateField(index, { key: e.target.value })}
            sx={{ width: { sm: 180 } }}
          />
          <TextField
            label={s.fieldLabel}
            size="small"
            value={field.label}
            onChange={(e) => updateField(index, { label: e.target.value })}
            sx={{ flex: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
              />
            }
            label={s.fieldRequired}
          />
          <Tooltip title={s.removeField}>
            <IconButton
              aria-label={`${s.removeField} ${field.label || field.key}`}
              onClick={() =>
                props.onChange({ captureFields: fields.filter((_, i) => i !== index) })
              }
              sx={{ "&:hover, &:focus-visible": { color: "error.main" } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
      <Box>
        <Button startIcon={<AddIcon />} onClick={addField}>
          {s.addField}
        </Button>
      </Box>
    </Stack>
  )
}
