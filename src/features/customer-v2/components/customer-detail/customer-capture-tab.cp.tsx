import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchProjectsThunk } from "../../../project/slice/projects.slice"
import {
  fetchCustomerMetadataThunk,
  saveCustomerMetadataThunk,
} from "../../redux/customer-metadata.slice"
import {
  customerCaptureFieldLabel,
  customerCaptureOptionLabel,
  customerCaptureProgress,
  customerCaptureStrings as s,
} from "../../../../i18n/locales/customer-capture.strings"

const TEXT_AUTOSAVE_MS = 450

function isFilled(value: string | undefined): boolean {
  return (value ?? "").trim() !== ""
}

function FieldCheckAdornment({ filled }: { filled: boolean }) {
  return (
    <InputAdornment position="end">
      <CheckIcon
        sx={{
          fontSize: 16,
          color: filled ? "success.main" : "action.disabled",
          transition: "color 200ms",
        }}
      />
    </InputAdornment>
  )
}

export default function CustomerCaptureTabCP({
  customerId,
}: {
  customerId: string
}) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((st) => st.customerMetadata.loading)
  const saving = useAppSelector((st) => st.customerMetadata.saving)
  const error = useAppSelector((st) => st.customerMetadata.error)
  const data = useAppSelector(
    (st) => st.customerMetadata.byCustomerId[customerId] ?? null
  )
  const projects = useAppSelector((st) => st.projects.projects)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const draftRef = useRef(draft)
  const textSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    if (customerId.trim() === "") {
      return
    }
    void dispatch(fetchCustomerMetadataThunk(customerId))
    void dispatch(fetchProjectsThunk())
    return () => {
      if (textSaveTimer.current) {
        clearTimeout(textSaveTimer.current)
      }
    }
  }, [customerId, dispatch])

  useEffect(() => {
    if (data) {
      setDraft({ ...data.values })
    }
  }, [data])

  const completeness = useMemo(() => {
    const fields = data?.fields ?? []
    const required = fields.filter((f) => f.required)
    let completed = 0
    for (const field of required) {
      if (isFilled(draft[field.key])) {
        completed += 1
      }
    }
    return {
      completed,
      total: required.length,
      isComplete: required.length > 0 && completed === required.length,
    }
  }, [data?.fields, draft])

  const persistValues = (values: Record<string, string>) => {
    void dispatch(
      saveCustomerMetadataThunk({ customerId, values })
    )
  }

  const commitField = (key: string, value: string, immediate: boolean) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      draftRef.current = next
      return next
    })
    if (!immediate) {
      if (textSaveTimer.current) {
        clearTimeout(textSaveTimer.current)
      }
      textSaveTimer.current = setTimeout(() => {
        persistValues(draftRef.current)
      }, TEXT_AUTOSAVE_MS)
      return
    }
    if (textSaveTimer.current) {
      clearTimeout(textSaveTimer.current)
      textSaveTimer.current = null
    }
    persistValues({ ...draftRef.current, [key]: value })
  }

  if (loading && data === null) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error && data === null) {
    return <Alert severity="error">{error}</Alert>
  }

  if (data === null) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.loadFailed}
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {s.stageLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {customerCaptureProgress(
            completeness.completed,
            completeness.total
          )}
          {saving ? ` · ${s.saving}` : null}
        </Typography>
      </Box>

      {!completeness.isComplete ? (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon fontSize="inherit" />}
          sx={{ py: 0.5 }}
        >
          <Typography variant="caption">{s.warning}</Typography>
        </Alert>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        gap={1.5}
      >
        {data.fields.map((field) => {
          const filled = isFilled(draft[field.key])
          const label = `${customerCaptureFieldLabel(field.key)}${
            field.required ? " *" : ""
          }`
          const span2 =
            field.type === "text" || field.type === "project"
              ? { gridColumn: { sm: "1 / -1" } }
              : undefined

          if (field.type === "text") {
            return (
              <TextField
                key={field.key}
                size="small"
                label={label}
                value={draft[field.key] ?? ""}
                placeholder={s.cityPlaceholder}
                onChange={(e) =>
                  commitField(field.key, e.target.value, false)
                }
                onBlur={() => {
                  if (textSaveTimer.current) {
                    clearTimeout(textSaveTimer.current)
                    textSaveTimer.current = null
                  }
                  persistValues(draftRef.current)
                }}
                InputProps={{
                  endAdornment: <FieldCheckAdornment filled={filled} />,
                }}
                sx={span2}
              />
            )
          }

          if (field.type === "project") {
            return (
              <FormControl key={field.key} size="small" fullWidth sx={span2}>
                <InputLabel id={`capture-${field.key}-label`}>
                  {label}
                </InputLabel>
                <Select
                  labelId={`capture-${field.key}-label`}
                  label={label}
                  value={draft[field.key] ?? ""}
                  onChange={(e) =>
                    commitField(field.key, String(e.target.value), true)
                  }
                  endAdornment={
                    <Box sx={{ mr: 2.5, display: "flex" }}>
                      <FieldCheckAdornment filled={filled} />
                    </Box>
                  }
                  sx={{ cursor: "pointer" }}
                >
                  {projects.map((project) => (
                    <MenuItem
                      key={project._id}
                      value={project._id}
                      sx={{ cursor: "pointer" }}
                    >
                      {project.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }

          return (
            <FormControl key={field.key} size="small" fullWidth>
              <InputLabel id={`capture-${field.key}-label`}>{label}</InputLabel>
              <Select
                labelId={`capture-${field.key}-label`}
                label={label}
                value={draft[field.key] ?? ""}
                onChange={(e) =>
                  commitField(field.key, String(e.target.value), true)
                }
                endAdornment={
                  <Box sx={{ mr: 2.5, display: "flex" }}>
                    <FieldCheckAdornment filled={filled} />
                  </Box>
                }
                sx={{ cursor: "pointer" }}
              >
                {(field.optionCodes ?? []).map((code) => (
                  <MenuItem
                    key={code}
                    value={code}
                    sx={{ cursor: "pointer" }}
                  >
                    {customerCaptureOptionLabel(field.key, code)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        })}
      </Box>
    </Stack>
  )
}
