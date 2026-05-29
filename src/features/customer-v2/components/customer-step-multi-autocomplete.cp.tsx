import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material"
import type { CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"

export type CustomerStepMultiAutocompleteCPProps = {
  readonly steps: readonly CustomerStepV2[]
  readonly value: readonly string[]
  readonly onChange: (stepIds: string[]) => void
  readonly label?: string
  readonly size?: "small" | "medium"
  readonly emptyHint?: string
}

function renderStepLabel(step: CustomerStepV2): string {
  const inactiveSuffix = step.isActive ? "" : " (inactivo)"
  return `${step.name}${inactiveSuffix}`
}

/**
 * Searchable multi-select for CRM customer steps (marketing audience / filters).
 */
export default function CustomerStepMultiAutocompleteCP({
  steps,
  value,
  onChange,
  label = "Steps",
  size = "small",
  emptyHint = "Todos los steps",
}: CustomerStepMultiAutocompleteCPProps) {
  const selectedSteps = steps.filter((step) => value.includes(step.id))
  return (
    <Autocomplete<CustomerStepV2, true, false, false>
      multiple
      fullWidth
      size={size}
      options={[...steps]}
      value={selectedSteps}
      onChange={(_event, newValue) => {
        onChange(newValue.map((step) => step.id))
      }}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={renderStepLabel}
      filterSelectedOptions
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
            ) : (
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "action.disabledBackground",
                  flexShrink: 0,
                }}
              />
            )}
            <Typography variant="body2">{renderStepLabel(option)}</Typography>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={selectedSteps.length === 0 ? emptyHint : undefined}
          margin="none"
          size={size}
        />
      )}
      ListboxProps={{
        sx: { "& .MuiAutocomplete-option": { cursor: "pointer" } },
      }}
    />
  )
}
