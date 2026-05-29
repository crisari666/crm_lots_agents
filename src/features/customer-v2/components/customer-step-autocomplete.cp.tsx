import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material"
import type { CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"

export type CustomerStepAutocompleteCPProps = {
  readonly steps: readonly CustomerStepV2[]
  readonly value: string
  readonly onChange: (stepId: string) => void
  readonly label?: string
  readonly size?: "small" | "medium"
}

function renderStepLabel(step: CustomerStepV2): string {
  const inactiveSuffix = step.isActive ? "" : " (inactivo)"
  return `${step.name}${inactiveSuffix}`
}

/**
 * Searchable single-select for CRM customer steps.
 */
export default function CustomerStepAutocompleteCP({
  steps,
  value,
  onChange,
  label = "Paso CRM",
  size = "small",
}: CustomerStepAutocompleteCPProps) {
  const selectedStep = steps.find((step) => step.id === value) ?? null
  return (
    <Autocomplete<CustomerStepV2, false, false, false>
      fullWidth
      size={size}
      options={[...steps]}
      value={selectedStep}
      onChange={(_event, newValue) => {
        onChange(newValue?.id ?? "")
      }}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={renderStepLabel}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {option.color?.trim() ? (
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: option.color,
                  flexShrink: 0,
                  border: 1,
                  borderColor: "divider",
                }}
              />
            ) : null}
            <Typography variant="body2">{renderStepLabel(option)}</Typography>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} margin="none" size={size} />
      )}
      ListboxProps={{
        sx: { "& .MuiAutocomplete-option": { cursor: "pointer" } },
      }}
    />
  )
}
