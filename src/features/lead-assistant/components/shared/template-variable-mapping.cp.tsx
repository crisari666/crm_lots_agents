import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined"
import { Alert, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  findApprovedTemplate,
  findUnmappedVariables,
} from "../../business-logic/render-template-preview"
import type {
  LeadTemplateBinding,
  LeadTemplateBindingSource,
  LeadTemplateRef,
  LeadWhatsappTemplateVariable,
} from "../../types/lead-assistant.types"

type Props = {
  readonly idPrefix: string
  readonly value: LeadTemplateRef
  readonly onChange: (next: LeadTemplateRef) => void
}

const SOURCES: readonly LeadTemplateBindingSource[] = [
  "customer_first_name",
  "assistant_name",
  "business_name",
  "project_title",
  "static",
]

function findBinding(
  ref: LeadTemplateRef,
  variable: LeadWhatsappTemplateVariable,
): LeadTemplateBinding | undefined {
  return ref.bindings.find(
    (binding) => binding.variable === variable.name && binding.component === variable.component,
  )
}

function upsertBinding(ref: LeadTemplateRef, next: LeadTemplateBinding): LeadTemplateRef {
  const exists = ref.bindings.some(
    (binding) => binding.variable === next.variable && binding.component === next.component,
  )
  return {
    ...ref,
    bindings: exists
      ? ref.bindings.map((binding) =>
          binding.variable === next.variable && binding.component === next.component ? next : binding,
        )
      : [...ref.bindings, next],
  }
}

/** Maps every variable of the chosen template to a value source. */
export default function TemplateVariableMappingCP(props: Props) {
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const approved =
    templates != null ? findApprovedTemplate(templates.templates, props.value) : undefined
  const variables: readonly LeadWhatsappTemplateVariable[] =
    approved?.variables ??
    props.value.bindings.map((binding) => ({
      name: binding.variable,
      component: binding.component,
      format: binding.format,
    }))
  const unmapped = findUnmappedVariables(approved, props.value)
  if (variables.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        {s.templateNoVariables}
      </Typography>
    )
  }
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{s.templateMappingTitle}</Typography>
      {variables.map((variable) => {
        const binding = findBinding(props.value, variable)
        const source = binding?.source ?? "static"
        const fieldId = `${props.idPrefix}-${variable.component}-${variable.name}`
        const isEmptyStatic = source === "static" && (binding?.staticValue ?? "").trim().length === 0
        return (
          <Stack key={fieldId} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "flex-start" }}>
            <TextField
              select
              size="small"
              id={fieldId}
              label={`{{${variable.name}}}`}
              value={source}
              onChange={(event) =>
                props.onChange(
                  upsertBinding(props.value, {
                    variable: variable.name,
                    component: variable.component,
                    format: variable.format,
                    source: event.target.value as LeadTemplateBindingSource,
                    ...(event.target.value === "static"
                      ? { staticValue: binding?.staticValue ?? "" }
                      : {}),
                  }),
                )
              }
              sx={{ minWidth: 220 }}
            >
              {SOURCES.map((option) => (
                <MenuItem key={option} value={option}>
                  {s.bindingSources[option]}
                </MenuItem>
              ))}
            </TextField>
            {source === "static" ? (
              <TextField
                size="small"
                fullWidth
                label={s.bindingStaticValue}
                value={binding?.staticValue ?? ""}
                error={isEmptyStatic}
                helperText={isEmptyStatic ? s.bindingStaticRequired : undefined}
                id={`${fieldId}-static`}
                onChange={(event) =>
                  props.onChange(
                    upsertBinding(props.value, {
                      variable: variable.name,
                      component: variable.component,
                      format: variable.format,
                      source: "static",
                      staticValue: event.target.value,
                    }),
                  )
                }
              />
            ) : null}
          </Stack>
        )
      })}
      {unmapped.length > 0 ? (
        <Alert severity="warning" icon={<WarningAmberOutlined />} role="status">
          {s.templateUnmapped(unmapped.map((name) => `{{${name}}}`).join(", "))}
        </Alert>
      ) : null}
    </Stack>
  )
}
