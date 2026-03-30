import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { UserImportFirstStepType } from "../../../app/services/users.service"

type Props = {
  value: UserImportFirstStepType | ""
  onChange: (value: UserImportFirstStepType | "") => void
  disabled?: boolean
}

const firstStepOptions: Array<{ value: UserImportFirstStepType; label: string }> = [
  {
    value: "scheduled_whatsapp_import_greeting",
    label: "WhatsApp programado (solo agendas de importación)"
  },
  {
    value: "immediate_whatsapp_import_sequence",
    label: "WhatsApp inmediato (flujo onboarding.user_imported)"
  },
  {
    value: "voice_call",
    label: "Llamada de voz"
  }
]

export default function ImportUsersFirstStepSelect({ value, onChange, disabled = false }: Props) {
  return (
    <FormControl fullWidth required size="small" sx={{ mb: 2 }}>
      <InputLabel id="import-users-first-step-label">Primer paso del flujo</InputLabel>
      <Select
        labelId="import-users-first-step-label"
        value={value}
        label="Primer paso del flujo"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as UserImportFirstStepType | "")}
      >
        <MenuItem value="">
          <em>Selecciona un paso</em>
        </MenuItem>
        {firstStepOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
