import React from "react"
import {
  TextField,
  Grid,
  Box,
  Typography,
  Link,
  InputAdornment,
  Paper,
  Stack,
  IconButton,
  Button
} from "@mui/material"
import type { Theme } from "@mui/material/styles"
import Add from "@mui/icons-material/Add"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { ProjectFormState } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectAmenitiesGroupsFieldCP from "./project-amenities-groups-field.cp"
import {
  normalizeProjectSlugInput,
  isValidProjectSlugForApi,
  PROJECT_SLUG_MAX_LENGTH
} from "../utils/project-slug.util"

type ProjectFormFieldsCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  disabled?: boolean
}

const modules = {
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

function FormSection({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Paper>
  )
}

export default function ProjectFormFieldsCP({
  form,
  onChange,
  disabled = false
}: ProjectFormFieldsCPProps) {
  const commissionValueCop = form.priceSell && form.commissionPercentage
    ? (form.priceSell * form.commissionPercentage) / 100
    : 0

  const lotOptions = form.lotOptions ?? []

  const slugNormalized = normalizeProjectSlugInput(form.slug ?? "")
  const slugInvalid =
    slugNormalized.length > 0 && !isValidProjectSlugForApi(slugNormalized)

  const updateLotRow = (index: number, patch: { area?: number; price?: number }) => {
    const next = lotOptions.map((row, i) => (i === index ? { ...row, ...patch } : row))
    onChange({ lotOptions: next })
  }

  const removeLotRow = (index: number) => {
    onChange({ lotOptions: lotOptions.filter((_, i) => i !== index) })
  }

  const addLotRow = () => {
    onChange({ lotOptions: [...lotOptions, { area: 0, price: 0 }] })
  }

  return (
    <Stack spacing={3}>
      <FormSection title={s.formSectionMainInfo}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={s.formFieldTitle}
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            disabled={disabled}
            required
          />
        </Grid>
        <Grid item xs={12}>
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
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            {s.formFieldDescription}
          </Typography>
          <Box
            sx={{
              mb: 0,
              "& .quill": {
                display: "flex",
                flexDirection: "column"
              },
              "& .ql-toolbar.ql-snow": {
                flexShrink: 0
              },
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
              modules={modules}
              readOnly={disabled}
            />
          </Box>
        </Grid>
      </FormSection>

      <ProjectAmenitiesGroupsFieldCP
        value={form.amenitiesGroups}
        onChange={(amenitiesGroups) => onChange({ amenitiesGroups })}
        disabled={disabled}
      />

      <FormSection title={s.formSectionLocation}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={s.formFieldLocation}
            value={form.location}
            onChange={(e) => onChange({ location: e.target.value })}
            disabled={disabled}
            placeholder={s.formFieldLocationPlaceholder}
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
        {form.location && (
          <Grid item xs={12}>
            <Link
              href={
                form.location.startsWith("http")
                  ? form.location
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.location)}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.formOpenInMaps}
            </Link>
          </Grid>
        )}
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
      </FormSection>

      <FormSection title={s.formSectionSellInfo}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={s.formFieldSellPrice}
            value={form.priceSell || ""}
            onChange={(e) => onChange({ priceSell: Number(e.target.value) || 0 })}
            disabled={disabled}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={s.formFieldCommissionPercent}
            value={form.commissionPercentage ?? ""}
            onChange={(e) =>
              onChange({ commissionPercentage: Number(e.target.value) || 0 })
            }
            disabled={disabled}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={s.formFieldCommissionCop}
            value={commissionValueCop}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={s.formFieldSeparation}
            value={form.separation ?? ""}
            onChange={(e) => onChange({ separation: Math.max(0, Number(e.target.value) || 0) })}
            disabled={disabled}
            helperText={s.formFieldSeparationHelper}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {s.formLotOptionsTitle}
          </Typography>
          {lotOptions.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {s.formLotOptionsEmptyHint}
            </Typography>
          )}
          <Stack spacing={1.5}>
            {lotOptions.map((row, index) => (
              <Grid container spacing={1} alignItems="flex-start" key={`lot-${index}`}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label={s.formLotOptionsArea}
                    value={row.area || ""}
                    onChange={(e) =>
                      updateLotRow(index, { area: Math.max(0, Number(e.target.value) || 0) })
                    }
                    disabled={disabled}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label={s.formLotOptionsPrice}
                    value={row.price || ""}
                    onChange={(e) =>
                      updateLotRow(index, { price: Math.max(0, Number(e.target.value) || 0) })
                    }
                    disabled={disabled}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    aria-label={s.formLotOptionsRemove}
                    onClick={() => removeLotRow(index)}
                    disabled={disabled}
                    color="error"
                    edge="end"
                  >
                    <DeleteOutline />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Stack>
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={addLotRow}
            disabled={disabled}
            sx={{ mt: 1.5 }}
          >
            {s.formLotOptionsAdd}
          </Button>
        </Grid>
      </FormSection>
    </Stack>
  )
}
