import React from "react"
import { Grid, Link, TextField } from "@mui/material"
import { ProjectFormState } from "../types/project.types"
import { ProjectFormSectionToggleProps } from "../types/project-form-section.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectFormSectionCP from "./project-form-section.cp"

type ProjectFormLocationSectionCPProps = ProjectFormSectionToggleProps & {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  disabled?: boolean
}

function buildMapsHref(location: string): string {
  if (location.startsWith("http")) return location
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}

export default function ProjectFormLocationSectionCP({
  form,
  onChange,
  disabled = false,
  isExpanded,
  onToggle
}: ProjectFormLocationSectionCPProps) {
  const summary = [form.city, form.state, form.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ")

  return (
    <ProjectFormSectionCP
      id="location"
      title={s.formSectionLocation}
      summary={summary || form.location.trim() || s.formSummaryEmpty}
      expanded={isExpanded("location")}
      onToggle={onToggle}
    >
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={s.formFieldLocation}
          value={form.location}
          onChange={(e) => onChange({ location: e.target.value })}
          disabled={disabled}
          placeholder={s.formFieldLocationPlaceholder}
          helperText={
            form.location ? (
              <Link href={buildMapsHref(form.location)} target="_blank" rel="noopener noreferrer">
                {s.formOpenInMaps}
              </Link>
            ) : undefined
          }
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label={s.formFieldCity}
          value={form.city ?? ""}
          onChange={(e) => onChange({ city: e.target.value })}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label={s.formFieldState}
          value={form.state ?? ""}
          onChange={(e) => onChange({ state: e.target.value })}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label={s.formFieldCountry}
          value={form.country ?? ""}
          onChange={(e) => onChange({ country: e.target.value })}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldLatitude}
          value={form.lat ?? ""}
          onChange={(e) => onChange({ lat: Number(e.target.value) || 0 })}
          disabled={disabled}
          inputProps={{ step: 0.000001 }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label={s.formFieldLongitude}
          value={form.lng ?? ""}
          onChange={(e) => onChange({ lng: Number(e.target.value) || 0 })}
          disabled={disabled}
          inputProps={{ step: 0.000001 }}
        />
      </Grid>
    </ProjectFormSectionCP>
  )
}
