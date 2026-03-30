import { useState } from "react"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import Add from "@mui/icons-material/Add"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import type { ProjectAmenitiesGroup } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import {
  AMENITY_GROUP_ICON_OPTIONS,
  AmenityGroupIconDisplay,
  labelForAmenityGroupIcon
} from "../config/project-amenity-group-icons.cp"

type Props = {
  value: ProjectAmenitiesGroup[]
  onChange: (next: ProjectAmenitiesGroup[]) => void
  disabled?: boolean
}

const emptyGroup = (): ProjectAmenitiesGroup => ({
  icon: "category",
  title: "",
  amenities: []
})

export default function ProjectAmenitiesGroupsFieldCP({ value, onChange, disabled = false }: Props) {
  const [iconDialogIndex, setIconDialogIndex] = useState<number | null>(null)

  const updateGroup = (index: number, patch: Partial<ProjectAmenitiesGroup>) => {
    const next = value.map((g, i) => (i === index ? { ...g, ...patch } : g))
    onChange(next)
  }

  const removeGroup = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const dialogGroup = iconDialogIndex != null ? value[iconDialogIndex] : null

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
        {s.formSectionAmenitiesGroups}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.formAmenitiesGroupsHint}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={() => onChange([...value, emptyGroup()])}
          disabled={disabled}
        >
          {s.formAmenitiesGroupsAddGroup}
        </Button>
      </Box>

      {value.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {s.formAmenitiesGroupsEmpty}
        </Typography>
      )}

      <Stack spacing={2}>
        {value.map((group, index) => (
          <Paper key={`ag-${index}`} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ flexShrink: 0 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    {s.formAmenitiesGroupsPickIcon}
                  </Typography>
                  <IconButton
                    aria-label={s.formAmenitiesGroupsPickIcon}
                    onClick={() => setIconDialogIndex(index)}
                    disabled={disabled}
                    color="primary"
                    sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                  >
                    <AmenityGroupIconDisplay iconId={group.icon} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label={s.formAmenitiesGroupsGroupTitle}
                  value={group.title}
                  onChange={(e) => updateGroup(index, { title: e.target.value })}
                  disabled={disabled}
                  required
                />
                <IconButton
                  aria-label={s.formAmenitiesGroupsRemoveGroup}
                  onClick={() => removeGroup(index)}
                  disabled={disabled}
                  color="error"
                  sx={{ mt: 2 }}
                >
                  <DeleteOutline />
                </IconButton>
              </Stack>
              <Autocomplete
                multiple
                freeSolo
                options={[] as string[]}
                value={group.amenities}
                onChange={(_, newValue) =>
                  updateGroup(index, {
                    amenities: newValue.map((v) => String(v).trim()).filter(Boolean)
                  })
                }
                disabled={disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={s.formAmenitiesGroupsLabels}
                    placeholder={s.formAmenitiesGroupsLabelsPlaceholder}
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, i) => (
                    <Chip {...getTagProps({ index: i })} key={`${option}-${i}`} label={option} size="small" />
                  ))
                }
              />
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog
        open={iconDialogIndex != null}
        onClose={() => setIconDialogIndex(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{s.formAmenitiesGroupsIconDialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ pt: 1 }}>
            {AMENITY_GROUP_ICON_OPTIONS.map((opt) => {
              const selected = dialogGroup?.icon === opt.id
              return (
                <Grid item xs={4} sm={3} key={opt.id}>
                  <Button
                    type="button"
                    variant={selected ? "contained" : "outlined"}
                    onClick={() => {
                      if (iconDialogIndex == null) return
                      updateGroup(iconDialogIndex, { icon: opt.id })
                      setIconDialogIndex(null)
                    }}
                    sx={{
                      width: "100%",
                      flexDirection: "column",
                      py: 1,
                      gap: 0.5,
                      textTransform: "none",
                      minHeight: 72
                    }}
                  >
                    <opt.Icon fontSize="medium" />
                    <Typography variant="caption" align="center" sx={{ lineHeight: 1.2 }}>
                      {labelForAmenityGroupIcon(opt.labelKey)}
                    </Typography>
                  </Button>
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setIconDialogIndex(null)}>
            {s.mediaPreviewClose}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
