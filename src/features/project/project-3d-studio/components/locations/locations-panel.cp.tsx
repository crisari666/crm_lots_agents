import React, { useMemo, useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from "@mui/material"
import {
  DeleteOutline as DeleteIcon,
  EditLocationAlt as EditPinIcon,
  MyLocation as LocateIcon,
  TravelExplore as DiscoverIcon,
  UploadFile as ImportIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  deleteLocationsBulkThunk,
  setActiveToolAct,
  setSelectionAct
} from "../../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import {
  getCategoryLabel,
  isStaleVerification
} from "../../utils/category-label.util"
import DiscoverDialogCP from "./discover-dialog.cp"
import GeoJsonImportDialogCP from "./geojson-import-dialog.cp"
import LocationEditorDrawerCP from "./location-editor-drawer.cp"
import AmenityCategoriesEditorCP from "./amenity-categories-editor.cp"

type Props = {
  projectId: string
  flyToLocation: (locationId: string) => void
}

export default function LocationsPanelCP({
  projectId,
  flyToLocation
}: Props) {
  const dispatch = useAppDispatch()
  const { locations, selection, actionLoading, activeTool, projectLatLng, experience } =
    useAppSelector((state: RootState) => state.project3dStudio)
  const [discoverOpen, setDiscoverOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, typeof locations>()
    for (const loc of locations) {
      const groupKey = loc.categoryKey || loc.category
      const list = map.get(groupKey) ?? []
      list.push(loc)
      map.set(groupKey, list)
    }
    return Array.from(map.entries())
  }, [locations])

  const selectedLocation =
    selection?.kind === "location"
      ? locations.find((l) => l._id === selection.id) ?? null
      : null

  const allIds = useMemo(() => locations.map((l) => l._id), [locations])
  const validCheckedIds = useMemo(
    () => checkedIds.filter((id) => allIds.includes(id)),
    [checkedIds, allIds]
  )
  const allChecked =
    allIds.length > 0 && validCheckedIds.length === allIds.length
  const someChecked =
    validCheckedIds.length > 0 && validCheckedIds.length < allIds.length

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setCheckedIds(allChecked ? [] : allIds)
  }

  const confirmBulkDelete = async () => {
    if (validCheckedIds.length === 0) return
    await dispatch(
      deleteLocationsBulkThunk({
        projectId,
        locationIds: validCheckedIds
      })
    )
    setCheckedIds([])
    setConfirmDeleteOpen(false)
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5 }} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="contained"
          startIcon={<DiscoverIcon />}
          onClick={() => setDiscoverOpen(true)}
        >
          {s.discoverTitle}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ImportIcon />}
          onClick={() => setImportOpen(true)}
          sx={{ color: "#e2e8f0", borderColor: "#334155" }}
        >
          {s.importGeoJson}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => dispatch(setActiveToolAct("point"))}
          sx={{ color: "#e2e8f0", borderColor: "#334155" }}
        >
          {s.toolPoint}
        </Button>
        <Tooltip
          title={
            projectLatLng ? s.projectPinRedefine : s.projectPinSetTool
          }
        >
          <IconButton
            size="small"
            aria-label={
              projectLatLng ? s.projectPinRedefine : s.projectPinSetTool
            }
            onClick={() =>
              dispatch(
                setActiveToolAct(
                  activeTool === "setProjectPin" ? "select" : "setProjectPin"
                )
              )
            }
            sx={{
              color:
                activeTool === "setProjectPin"
                  ? "#38bdf8"
                  : projectLatLng
                    ? "#94a3b8"
                    : "#fbbf24",
              bgcolor:
                activeTool === "setProjectPin"
                  ? "rgba(56,189,248,0.12)"
                  : "transparent",
              border: "1px solid",
              borderColor:
                activeTool === "setProjectPin"
                  ? "#38bdf8"
                  : projectLatLng
                    ? "#334155"
                    : "#f59e0b",
              borderRadius: 1
            }}
          >
            <EditPinIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <AmenityCategoriesEditorCP projectId={projectId} />
      {locations.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ px: 1.5, pb: 1 }}
          flexWrap="wrap"
          useFlexGap
        >
          <Checkbox
            size="small"
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleSelectAll}
            sx={{ color: "#94a3b8", p: 0.5 }}
          />
          <Button
            size="small"
            onClick={toggleSelectAll}
            sx={{ color: "#94a3b8", minWidth: 0, px: 0.5 }}
          >
            {allChecked ? s.clearLocationSelection : s.selectAllLocations}
          </Button>
          {validCheckedIds.length > 0 && (
            <Button
              size="small"
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              disabled={actionLoading}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              {actionLoading
                ? s.deletingLocations
                : s.deleteSelectedLocations.replace(
                    "{count}",
                    String(validCheckedIds.length)
                  )}
            </Button>
          )}
        </Stack>
      )}
      {locations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ color: "#f8fafc", mb: 1 }}>
            {s.locationsEmptyTitle}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDiscoverOpen(true)}
          >
            {s.locationsEmptyAction}
          </Button>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto", flex: 1, px: 1 }}>
          {grouped.map(([category, rows]) => (
            <Box key={category} sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", px: 1, textTransform: "uppercase" }}
              >
                {(experience?.amenityCategories ?? []).find((row) => row.key === category)
                  ?.label ?? getCategoryLabel(category as never)} ({rows.length})
              </Typography>
              <List dense disablePadding>
                {rows.map((loc) => {
                  const selected =
                    selection?.kind === "location" && selection.id === loc._id
                  const checked = checkedIds.includes(loc._id)
                  return (
                    <ListItemButton
                      key={loc._id}
                      selected={selected}
                      onClick={() =>
                        dispatch(
                          setSelectionAct({ kind: "location", id: loc._id })
                        )
                      }
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        pr: 6,
                        color: "#e2e8f0",
                        "&.Mui-selected": {
                          bgcolor: "rgba(56,189,248,0.16)"
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          size="small"
                          checked={checked}
                          tabIndex={-1}
                          disableRipple
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleChecked(loc._id)}
                          sx={{ color: "#94a3b8" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={loc.name}
                        secondary={
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            <Chip
                              size="small"
                              label={
                                loc.isVerified ? s.verified : s.unverified
                              }
                              color={loc.isVerified ? "success" : "warning"}
                            />
                            {!loc.isVisible && (
                              <Chip size="small" label={s.hidden} />
                            )}
                            {isStaleVerification(loc.verifiedAt) && (
                              <Chip
                                size="small"
                                color="warning"
                                label={s.staleVerification}
                              />
                            )}
                            {loc.distanceMeters != null && (
                              <Chip
                                size="small"
                                variant="outlined"
                                label={`${loc.distanceMeters} m ${s.discoverStraightLine}`}
                              />
                            )}
                          </Stack>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title={s.locateOnMap}>
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label={s.locateOnMap}
                            onClick={(e) => {
                              e.stopPropagation()
                              dispatch(
                                setSelectionAct({
                                  kind: "location",
                                  id: loc._id
                                })
                              )
                              flyToLocation(loc._id)
                            }}
                            sx={{ color: "#7dd3fc" }}
                          >
                            <LocateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  )
                })}
              </List>
            </Box>
          ))}
        </Box>
      )}
      <DiscoverDialogCP
        open={discoverOpen}
        onClose={() => setDiscoverOpen(false)}
        projectId={projectId}
      />
      <GeoJsonImportDialogCP
        open={importOpen}
        onClose={() => setImportOpen(false)}
        projectId={projectId}
      />
      <LocationEditorDrawerCP
        projectId={projectId}
        location={selectedLocation}
        onClose={() => dispatch(setSelectionAct(null))}
      />
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>{s.delete}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {s.deleteSelectedConfirm.replace(
              "{count}",
              String(validCheckedIds.length)
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>
            {s.cancel}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={actionLoading}
            onClick={() => void confirmBulkDelete()}
          >
            {actionLoading ? s.deletingLocations : s.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
