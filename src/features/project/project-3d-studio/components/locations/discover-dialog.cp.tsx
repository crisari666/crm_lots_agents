import React, { useState } from "react"
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  clearDiscoverAct,
  createLocationThunk,
  discoverLocationsThunk,
  setDiscoverRadiusAct,
  toggleDiscoverCandidateAct
} from "../../slice/project-3d-studio.slice"
import { LOCATION_CATEGORIES } from "../../types/project-experience.types"
import type { ProjectLocationCategory } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import { getCategoryLabel } from "../../utils/category-label.util"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
}

export default function DiscoverDialogCP({
  open,
  onClose,
  projectId
}: Props) {
  const dispatch = useAppDispatch()
  const {
    discoverCandidates,
    selectedDiscoverSourceIds,
    discoverLoading,
    discoverRadiusMeters,
    discoverProvider,
    discoverError
  } = useAppSelector((state: RootState) => state.project3dStudio)
  const [categories, setCategories] = useState<ProjectLocationCategory[]>([
    "hospital",
    "education",
    "shopping",
    "tourism",
    "nature",
    "transport",
    "town",
    "services"
  ])

  const runDiscover = () => {
    void dispatch(
      discoverLocationsThunk({
        projectId,
        radiusMeters: discoverRadiusMeters,
        categories
      })
    )
  }

  const addSelected = async () => {
    const selected = discoverCandidates.filter((c) =>
      selectedDiscoverSourceIds.includes(c.sourceId)
    )
    for (const candidate of selected) {
      await dispatch(
        createLocationThunk({
          projectId,
          data: {
            name: candidate.name,
            category: candidate.category,
            geometry: candidate.geometry,
            source: "mapbox",
            sourceId: candidate.sourceId,
            attribution: candidate.attribution
          }
        })
      )
    }
    dispatch(clearDiscoverAct())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{s.discoverTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">{s.discoverRadius}</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={discoverRadiusMeters}
            onChange={(_e, value: number | null) => {
              if (value) dispatch(setDiscoverRadiusAct(value))
            }}
          >
            <ToggleButton value={5000}>{s.discoverRadius5}</ToggleButton>
            <ToggleButton value={10000}>{s.discoverRadius10}</ToggleButton>
            <ToggleButton value={20000}>{s.discoverRadius20}</ToggleButton>
          </ToggleButtonGroup>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {LOCATION_CATEGORIES.filter((c) => c !== "road" && c !== "other").map(
              (cat) => (
                <FormControlLabel
                  key={cat}
                  control={
                    <Checkbox
                      size="small"
                      checked={categories.includes(cat)}
                      onChange={(e) => {
                        setCategories((prev) =>
                          e.target.checked
                            ? [...prev, cat]
                            : prev.filter((x) => x !== cat)
                        )
                      }}
                    />
                  }
                  label={getCategoryLabel(cat)}
                />
              )
            )}
          </Stack>
          <Button
            variant="contained"
            disabled={discoverLoading || categories.length === 0}
            onClick={runDiscover}
          >
            {discoverLoading ? s.discoverLoading : s.discoverRun}
          </Button>
          {discoverError && !discoverLoading && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={runDiscover}>
                  {s.discoverRetry}
                </Button>
              }
            >
              <AlertTitle>{s.discoverErrorTitle}</AlertTitle>
              {s.discoverErrorHint}
            </Alert>
          )}
          {!discoverError && discoverProvider && !discoverLoading && (
            <Typography variant="caption" color="text.secondary">
              {s.discoverProviderMapbox}
              {" · "}
              {discoverCandidates.length}
            </Typography>
          )}
          {discoverError ? null : discoverCandidates.length === 0 &&
            !discoverLoading ? (
            <Typography color="text.secondary">{s.discoverEmpty}</Typography>
          ) : (
            <List dense sx={{ maxHeight: 360, overflow: "auto" }}>
              {discoverCandidates.map((candidate) => (
                <ListItem
                  key={candidate.sourceId}
                  button
                  onClick={() =>
                    dispatch(toggleDiscoverCandidateAct(candidate.sourceId))
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedDiscoverSourceIds.includes(
                        candidate.sourceId
                      )}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={candidate.name}
                    secondary={`${getCategoryLabel(candidate.category)} · ${candidate.distanceMeters} m ${s.discoverStraightLine}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          disabled={selectedDiscoverSourceIds.length === 0}
          onClick={() => void addSelected()}
        >
          {s.discoverAddSelected}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
