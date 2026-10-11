import React from "react"
import { Box, Grid, TextField, Typography } from "@mui/material"
import type { Theme } from "@mui/material/styles"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { ProjectFormState } from "../types/project.types"
import { ProjectFormSectionToggleProps } from "../types/project-form-section.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectFormSectionCP from "./project-form-section.cp"
import {
  normalizeProjectSlugInput,
  isValidProjectSlugForApi,
  PROJECT_SLUG_MAX_LENGTH
} from "../utils/project-slug.util"

const PROJECT_SHORT_DESCRIPTION_MAX_LENGTH = 300

type ProjectFormGeneralSectionCPProps = ProjectFormSectionToggleProps & {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  disabled?: boolean
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ]
}

const descriptionEditorMinHeight = (theme: Theme) => {
  const lh = theme.typography.body1.lineHeight
  const lineHeightUnitless =
    typeof lh === "number" ? lh : Number.parseFloat(String(lh)) || 1.5
  return `${4 * lineHeightUnitless}em`
}

export default function ProjectFormGeneralSectionCP({
  form,
  onChange,
  disabled = false,
  isExpanded,
  onToggle
}: ProjectFormGeneralSectionCPProps) {
  const slugNormalized = normalizeProjectSlugInput(form.slug ?? "")
  const slugInvalid =
    slugNormalized.length > 0 && !isValidProjectSlugForApi(slugNormalized)
  const hasError = slugInvalid || !form.title.trim()
  const shortDescriptionLength = form.shortDescription.length

  return (
    <ProjectFormSectionCP
      id="general"
      title={s.formSectionMainInfo}
      summary={form.title.trim() || s.formSummaryEmpty}
      hasError={hasError}
      expanded={isExpanded("general")}
      onToggle={onToggle}
    >
      <Grid item xs={12} md={7}>
        <TextField
          fullWidth
          label={s.formFieldTitle}
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          disabled={disabled}
          required
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <TextField
          fullWidth
          label={s.formFieldSlug}
          value={form.slug ?? ""}
          onChange={(e) => onChange({ slug: e.target.value })}
          onBlur={() => {
            const n = normalizeProjectSlugInput(form.slug ?? "")
            if (n !== form.slug) onChange({ slug: n })
          }}
          disabled={disabled}
          error={slugInvalid}
          helperText={slugInvalid ? s.formFieldSlugErrorInvalid : s.formFieldSlugHelper}
          inputProps={{ maxLength: PROJECT_SLUG_MAX_LENGTH }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          label={s.formFieldShortDescription}
          value={form.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          disabled={disabled}
          inputProps={{ maxLength: PROJECT_SHORT_DESCRIPTION_MAX_LENGTH }}
          helperText={
            <Box component="span" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <span>{s.formFieldShortDescriptionHelper}</span>
              <Box
                component="span"
                sx={{
                  fontVariantNumeric: "tabular-nums",
                  color:
                    shortDescriptionLength >= PROJECT_SHORT_DESCRIPTION_MAX_LENGTH
                      ? "warning.main"
                      : "inherit"
                }}
              >
                {shortDescriptionLength}/{PROJECT_SHORT_DESCRIPTION_MAX_LENGTH}
              </Box>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          {s.formFieldDescription}
        </Typography>
        <Box
          sx={{
            "& .quill": { display: "flex", flexDirection: "column" },
            "& .ql-toolbar.ql-snow": { flexShrink: 0 },
            "& .ql-container.ql-snow": {
              flex: "1 1 auto",
              height: "auto",
              minHeight: (theme) => descriptionEditorMinHeight(theme)
            },
            "& .ql-editor": {
              height: "auto",
              minHeight: (theme) => descriptionEditorMinHeight(theme)
            }
          }}
        >
          <ReactQuill
            theme="snow"
            value={form.description}
            onChange={(value) => onChange({ description: value })}
            modules={quillModules}
            readOnly={disabled}
          />
        </Box>
      </Grid>
    </ProjectFormSectionCP>
  )
}
