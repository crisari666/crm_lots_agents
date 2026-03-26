import React from "react"
import {
  TextField,
  Grid,
  Box,
  Typography,
  Link,
  Autocomplete,
  Chip,
  InputAdornment
} from "@mui/material"
import type { Theme } from "@mui/material/styles"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { ProjectFormState } from "../types/project.types"
import { AmenityType } from "../types/amenity.types"

type ProjectFormFieldsCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  amenities: AmenityType[]
  disabled?: boolean
  onAddAmenity?: (title: string) => Promise<string | null>
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

export default function ProjectFormFieldsCP({
  form,
  onChange,
  amenities,
  disabled = false,
  onAddAmenity
}: ProjectFormFieldsCPProps) {
  const commissionValueCop = form.priceSell && form.commissionPercentage
    ? (form.priceSell * form.commissionPercentage) / 100
    : 0

  const amenityOptions = amenities.map((a) => ({ _id: a._id, title: a.title }))
  const selectedAmenityIds = form.amenities || []
  const selectedAmenities = amenityOptions.filter((o) => selectedAmenityIds.includes(o._id))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Title"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          disabled={disabled}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
          Description
        </Typography>
        <Box
          sx={{
            mb: 2,
            /* Quill uses height: 100% on .ql-container / .ql-editor; .quill has no height, so % resolves to 0 */
            "& .quill": {
              display: "flex",
              flexDirection: "column",
            },
            "& .ql-toolbar.ql-snow": {
              flexShrink: 0,
            },
            "& .ql-container.ql-snow": {
              flex: "1 1 auto",
              height: "auto",
              minHeight: (theme) => descriptionEditorMinHeight(theme),
            },
            "& .ql-editor": {
              height: "auto",
              minHeight: (theme) => descriptionEditorMinHeight(theme),
            },
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
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Sell price"
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
          label="Commission %"
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
          label="Commission (COP)"
          value={commissionValueCop}
          disabled
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Location"
          value={form.location}
          onChange={(e) => onChange({ location: e.target.value })}
          disabled={disabled}
          placeholder="Address or Google Maps link"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="City"
          value={form.city ?? ""}
          onChange={(e) => onChange({ city: e.target.value })}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="State"
          value={form.state ?? ""}
          onChange={(e) => onChange({ state: e.target.value })}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Country"
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
            Open in Google Maps
          </Link>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Latitude"
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
          label="Longitude"
          value={form.lng ?? ""}
          onChange={(e) => onChange({ lng: Number(e.target.value) || 0 })}
          disabled={disabled}
          inputProps={{ step: 0.000001 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={amenityOptions}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.title)}
          value={selectedAmenities}
          onChange={(_, newValue) => {
            const ids = newValue
              .map((o) => (typeof o === "object" && o && "_id" in o ? (o as { _id: string })._id : ""))
              .filter(Boolean)
            onChange({ amenities: ids })
          }}
          freeSolo
          filterOptions={(options, params) => {
            const input = params.inputValue.trim()
            const filtered = options.filter((o) =>
              o.title.toLowerCase().includes(input.toLowerCase())
            )
            if (input && onAddAmenity && !options.some((o) => o.title.toLowerCase() === input.toLowerCase())) {
              return [...filtered, { _id: `new:${input}`, title: `Add "${input}"` }]
            }
            return filtered
          }}
          onInputChange={(_, value, reason) => {
            if (reason === "input" && value.trim() && onAddAmenity) {
              const match = amenityOptions.find(
                (o) => o.title.toLowerCase() === value.trim().toLowerCase()
              )
              if (!match) {
                // Option to add will appear via filterOptions
              }
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Amenities" placeholder="Select or add" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const o = option as { _id: string; title: string }
              return (
                <Chip
                  {...getTagProps({ index })}
                  key={o._id}
                  label={o.title}
                  size="small"
                />
              )
            })
          }
          renderOption={(props, option) => {
            const opt = option as { _id: string; title: string }
            const isNew = String(opt._id).startsWith("new:")
            const { onClick: optionListItemOnClick, ...liProps } = props
            return (
              <li
                {...liProps}
                key={opt._id}
                onClick={(e) => {
                  if (isNew && onAddAmenity) {
                    e.preventDefault()
                    void (async () => {
                      const title = opt.title.replace(/^Add "|"$/g, "")
                      const newId = await onAddAmenity(title)
                      if (newId) onChange({ amenities: [...selectedAmenityIds, newId] })
                    })()
                    return
                  }
                  optionListItemOnClick?.(e)
                }}
              >
                {opt.title}
              </li>
            )
          }}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  )
}
