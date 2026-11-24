import RefreshOutlined from "@mui/icons-material/RefreshOutlined"
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  buildTemplateKey,
  buildTemplateRef,
  findApprovedTemplate,
} from "../../business-logic/render-template-preview"
import { fetchTemplatesThunk } from "../../slice/lead-assistant-setup.slice"
import type { LeadTemplateRef, LeadWhatsappTemplate } from "../../types/lead-assistant.types"

type Props = {
  readonly id: string
  readonly label: string
  readonly value: LeadTemplateRef | null
  readonly onChange: (next: LeadTemplateRef | null) => void
  readonly helperText?: string
}

function toPlaceholderTemplate(ref: LeadTemplateRef): LeadWhatsappTemplate {
  return {
    name: ref.name,
    language: ref.language,
    category: "",
    bodyText: ref.bodyText,
    buttons: [],
    variables: [],
    isSupported: true,
  }
}

/** Autocomplete over the approved WhatsApp templates of the leads line. */
export default function TemplatePickerCP(props: Props) {
  const dispatch = useAppDispatch()
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const status = useAppSelector((state) => state.leadAssistant.setup.templatesStatus)
  const options = useMemo(() => [...(templates?.templates ?? [])], [templates])
  const approved =
    props.value != null && templates != null
      ? findApprovedTemplate(templates.templates, props.value)
      : undefined
  const selected = props.value != null ? approved ?? toPlaceholderTemplate(props.value) : null
  const isUnapproved = props.value != null && templates != null && approved == null
  const isLoading = status === "loading"
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Autocomplete<LeadWhatsappTemplate>
          id={props.id}
          fullWidth
          options={options}
          value={selected}
          loading={isLoading}
          loadingText={s.loading}
          noOptionsText={s.templatePickerEmpty}
          getOptionLabel={(option) => `${option.name} (${option.language})`}
          getOptionDisabled={(option) => !option.isSupported}
          isOptionEqualToValue={(option, current) =>
            buildTemplateKey(option.name, option.language) ===
            buildTemplateKey(current.name, current.language)
          }
          onChange={(_, option) => {
            if (option == null) {
              props.onChange(null)
              return
            }
            const isSame =
              props.value != null &&
              props.value.name === option.name &&
              props.value.language === option.language
            props.onChange(isSame ? props.value : buildTemplateRef(option))
          }}
          renderOption={(optionProps, option) => (
            <Box component="li" {...optionProps} key={buildTemplateKey(option.name, option.language)}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600}>
                  {option.name} · {option.language}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {option.isSupported
                    ? option.bodyText
                    : s.templateUnsupported[option.unsupportedReason ?? "media_header"]}
                </Typography>
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.label}
              helperText={props.helperText ?? s.templatePickerHelper}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Tooltip title={s.templateReload}>
          <span>
            <IconButton
              aria-label={s.templateReload}
              onClick={() => void dispatch(fetchTemplatesThunk(true))}
              disabled={isLoading}
              sx={{ mt: 0.5 }}
            >
              <RefreshOutlined />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      {isUnapproved ? (
        <Alert severity="warning" role="status">
          {s.templateUnapproved}
        </Alert>
      ) : null}
    </Stack>
  )
}
