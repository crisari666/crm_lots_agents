import React from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  InsertDriveFile as FileIcon
} from "@mui/icons-material"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import type {
  ProjectIngestionDocType,
  ProjectIngestionDocumentRow,
  ProjectIngestionSourceMode
} from "../types/project-document-ingestion.types"
import { ALL_INGESTION_DOC_TYPES } from "../utils/global-document-ingestion-load.utils"

function docTypeLabel(docType: ProjectIngestionDocType): string {
  switch (docType) {
    case "images":
      return s.ingestionDocTypeImages
    case "plane":
      return s.ingestionDocTypePlane
    case "brochure":
      return s.ingestionDocTypeBrochure
    case "reellVideo":
      return s.ingestionDocTypeReellVideo
    case "rut":
      return s.ingestionDocTypeRut
    case "business_registration":
      return s.ingestionDocTypeBusinessRegistration
    case "bank_certificate":
      return s.ingestionDocTypeBankCertificate
    case "libertarian_certificate":
      return s.ingestionDocTypeLibertarianCertificate
    default:
      return s.ingestionDocTypeOther
  }
}

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function globalIngestionRowReady(row: ProjectIngestionDocumentRow): boolean {
  if (row.rawText.trim().length === 0) return false
  if (row.docType === "other" && row.documentKeyName.trim().length === 0) return false
  if (row.sourceMode === "upload") return !!row.file
  return isValidHttpUrl(row.externalUrl)
}

type Props = {
  row: ProjectIngestionDocumentRow
  isSubmitted: boolean
  onUpdate: (id: string, patch: Partial<ProjectIngestionDocumentRow>) => void
  onRemove?: (id: string) => void
  canRemove: boolean
}

export default function GlobalDocumentIngestionCardCP({
  row,
  isSubmitted,
  onUpdate,
  onRemove,
  canRemove
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const ready = globalIngestionRowReady(row)

  const handleSourceMode = (_: React.MouseEvent<HTMLElement>, mode: ProjectIngestionSourceMode | null) => {
    if (!mode) return
    onUpdate(row.id, {
      sourceMode: mode,
      externalUrl: "",
      file: undefined
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpdate(row.id, { file })
    e.target.value = ""
  }

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value as ProjectIngestionDocType
    onUpdate(row.id, {
      docType: v,
      documentKeyName: v === "other" ? row.documentKeyName : ""
    })
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: ready ? "primary.light" : "divider",
        borderRadius: 1,
        "&:before": { display: "none" }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%", pr: 1, flexWrap: "wrap" }}>
          {isSubmitted ? (
            <CheckCircleIcon color="primary" fontSize="small" />
          ) : (
            <FileIcon fontSize="small" color="action" />
          )}
          <Typography variant="subtitle2" fontWeight={600}>
            {docTypeLabel(row.docType)}
          </Typography>
          {row.docType === "other" && (
            <Chip size="small" label={s.documentIngestionAdditionalBadge} variant="outlined" />
          )}
          {row.isEdited && (
            <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
              {s.documentIngestionEditedBadge}
            </Typography>
          )}
          {ready && (
            <Typography variant="caption" color="primary" sx={{ ml: "auto" }}>
              {s.documentIngestionComplete}
            </Typography>
          )}
          {onRemove && canRemove && !isSubmitted && (
            <IconButton
              size="small"
              aria-label="remove"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(row.id)
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <TextField
            select
            label={s.globalIngestionDocTypeLabel}
            value={row.docType}
            onChange={handleDocTypeChange}
            fullWidth
          >
            {ALL_INGESTION_DOC_TYPES.map((dt) => (
              <MenuItem key={dt} value={dt}>
                {docTypeLabel(dt)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={s.documentIngestionDescriptionLabel}
            placeholder={s.documentIngestionDescriptionPlaceholder}
            helperText={s.documentIngestionDescriptionHelper}
            value={row.rawText}
            onChange={(e) => onUpdate(row.id, { rawText: e.target.value })}
            multiline
            minRows={3}
            fullWidth
            required
          />

          {row.docType === "other" && (
            <TextField
              label={s.documentIngestionOtherDocumentKey}
              placeholder={s.documentIngestionOtherDocumentKeyPlaceholder}
              helperText={s.documentIngestionOtherDocumentKeyHelper}
              value={row.documentKeyName}
              onChange={(e) => onUpdate(row.id, { documentKeyName: e.target.value })}
              fullWidth
              required
            />
          )}

          <Box>
            <InputLabel sx={{ mb: 0.5 }}>{s.documentIngestionSourceModeLabel}</InputLabel>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={row.sourceMode}
              onChange={handleSourceMode}
            >
              <ToggleButton value="upload">{s.documentIngestionModeUpload}</ToggleButton>
              <ToggleButton value="url">{s.documentIngestionModeUrl}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {row.sourceMode === "url" && (
            <TextField
              label={s.documentIngestionExternalUrl}
              placeholder={s.documentIngestionExternalUrlPlaceholder}
              helperText={s.documentIngestionExternalUrlHelper}
              value={row.externalUrl}
              onChange={(e) => onUpdate(row.id, { externalUrl: e.target.value })}
              fullWidth
            />
          )}

          {row.sourceMode === "upload" && (
            <Box>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.xls,.xlsx,.csv"
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                fullWidth
              >
                {row.file ? row.file.name : s.documentIngestionPickFile}
              </Button>
              {row.file && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  {(row.file.size / 1024).toFixed(1)} KB
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
