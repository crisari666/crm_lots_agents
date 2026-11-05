import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  deleteLocationThunk,
  setRelocatingLocationIdAct,
  updateLocationThunk,
  uploadLocationGalleryThunk,
  verifyLocationThunk
} from "../../slice/project-3d-studio.slice"
import type { ProjectLocationImportance, ProjectLocationType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import { buildExperienceAssetUrl } from "../../utils/experience-asset-url.util"

type Props = {
  projectId: string
  location: ProjectLocationType | null
  onClose: () => void
}

function readPointCoordinates(
  location: ProjectLocationType
): { latitude: string; longitude: string } | null {
  if (location.geometry.type !== "Point") return null
  if (!Array.isArray(location.geometry.coordinates)) return null
  const pair = location.geometry.coordinates as unknown[]
  const longitude = Number(pair[0])
  const latitude = Number(pair[1])
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null
  return { latitude: String(latitude), longitude: String(longitude) }
}

function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90
}

function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180
}

export default function LocationEditorDrawerCP({
  projectId,
  location,
  onClose
}: Props) {
  const dispatch = useAppDispatch()
  const amenityCategories = useAppSelector(
    (state: RootState) => state.project3dStudio.experience?.amenityCategories ?? []
  )
  const panoramaAssets = useAppSelector((state: RootState) =>
    state.project3dStudio.assets.filter((asset) => asset.type === "panorama")
  )
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const activeTool = useAppSelector(
    (state: RootState) => state.project3dStudio.activeTool
  )
  const relocatingLocationId = useAppSelector(
    (state: RootState) => state.project3dStudio.relocatingLocationId
  )
  const [categoryKey, setCategoryKey] = useState("")
  const [panoramaAssetId, setPanoramaAssetId] = useState("")
  const [importance, setImportance] =
    useState<ProjectLocationImportance>("medium")
  const [isVisible, setIsVisible] = useState(true)
  const [estimatedTravelMinutes, setEstimatedTravelMinutes] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [coordError, setCoordError] = useState("")
  const isPoint = location?.geometry.type === "Point"

  useEffect(() => {
    if (!location) return
    setName(location.name)
    setDescription(location.description ?? "")
    setSubtitle(location.subtitle ?? "")
    setCategoryKey(location.categoryKey ?? "")
    setPanoramaAssetId(location.panoramaAssetId ?? "")
    setImportance(location.importance)
    setIsVisible(location.isVisible)
    setEstimatedTravelMinutes(
      location.estimatedTravelMinutes != null
        ? String(location.estimatedTravelMinutes)
        : ""
    )
    const point = readPointCoordinates(location)
    setLatitude(point?.latitude ?? "")
    setLongitude(point?.longitude ?? "")
    setCoordError("")
  }, [location])

  if (!location) return null

  const save = async () => {
    const parsedLatitude = Number(latitude)
    const parsedLongitude = Number(longitude)
    if (
      isPoint &&
      (!isValidLatitude(parsedLatitude) || !isValidLongitude(parsedLongitude))
    ) {
      setCoordError(s.locationCoordInvalid)
      return
    }
    await dispatch(
      updateLocationThunk({
        projectId,
        locationId: location._id,
        data: {
          name,
          description,
          subtitle,
          categoryKey,
          panoramaAssetId,
          importance,
          isVisible,
          estimatedTravelMinutes:
            estimatedTravelMinutes.trim() === ""
              ? undefined
              : Number(estimatedTravelMinutes),
          ...(isPoint
            ? {
                geometry: {
                  type: "Point" as const,
                  coordinates: [parsedLongitude, parsedLatitude]
                }
              }
            : {})
        }
      })
    )
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={Boolean(location)}
      onClose={onClose}
      PaperProps={{ sx: { width: 360, bgcolor: "#0f172a", color: "#e2e8f0" } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {amenityCategories.find((row) => row.key === location.categoryKey)?.label ??
            location.name}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={s.name}
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.locationSubtitle}
            size="small"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            inputProps={{ maxLength: 160 }}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>{s.amenityCategory}</InputLabel>
            <Select
              label={s.amenityCategory}
              value={categoryKey}
              onChange={(e) => setCategoryKey(String(e.target.value))}
            >
              <MenuItem value="">{s.amenityCategoryNone}</MenuItem>
              {amenityCategories.map((row) => (
                <MenuItem key={row.key} value={row.key}>
                  {row.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>{s.locationPanorama}</InputLabel>
            <Select
              label={s.locationPanorama}
              value={panoramaAssetId}
              onChange={(event) => {
                const nextId = String(event.target.value)
                setPanoramaAssetId(nextId)
                const shot = panoramaAssets.find((asset) => asset._id === nextId)
                if (!shot || !isPoint) return
                setLatitude(String(shot.position.latitude))
                setLongitude(String(shot.position.longitude))
                setCoordError("")
              }}
            >
              <MenuItem value="">{s.locationPanoramaNone}</MenuItem>
              {panoramaAssets.map((asset) => (
                <MenuItem key={asset._id} value={asset._id}>
                  {asset.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {isPoint && (
            <>
              <TextField
                label={s.locationLatitude}
                size="small"
                type="number"
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value)
                  setCoordError("")
                }}
                error={Boolean(coordError)}
                inputProps={{ min: -90, max: 90, step: "any" }}
                fullWidth
              />
              <TextField
                label={s.locationLongitude}
                size="small"
                type="number"
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value)
                  setCoordError("")
                }}
                error={Boolean(coordError)}
                helperText={coordError || undefined}
                inputProps={{ min: -180, max: 180, step: "any" }}
                fullWidth
              />
              <Button
                variant={
                  activeTool === "relocateLocation" &&
                  relocatingLocationId === location._id
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  const isThisLocation =
                    activeTool === "relocateLocation" &&
                    relocatingLocationId === location._id
                  dispatch(
                    setRelocatingLocationIdAct(isThisLocation ? null : location._id)
                  )
                }}
              >
                {s.locationRedefine}
              </Button>
            </>
          )}
          <TextField
            label={s.description}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>{s.importance}</InputLabel>
            <Select
              label={s.importance}
              value={importance}
              onChange={(e) =>
                setImportance(e.target.value as ProjectLocationImportance)
              }
            >
              <MenuItem value="low">{s.importanceLow}</MenuItem>
              <MenuItem value="medium">{s.importanceMedium}</MenuItem>
              <MenuItem value="high">{s.importanceHigh}</MenuItem>
              <MenuItem value="featured">{s.importanceFeatured}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={s.estimatedMinutes}
            size="small"
            type="number"
            value={estimatedTravelMinutes}
            onChange={(e) => setEstimatedTravelMinutes(e.target.value)}
            helperText={s.estimatedBadge}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
            }
            label={isVisible ? s.visible : s.hidden}
          />
          {location.distanceMeters != null && (
            <Typography variant="caption" color="text.secondary">
              {location.distanceMeters} m {s.discoverStraightLine}
            </Typography>
          )}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {s.amenityGallery}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1, overflowX: "auto" }}>
              {(location.media?.gallery ?? []).map((fileName) => (
                <Box
                  key={fileName}
                  component="img"
                  src={buildExperienceAssetUrl(fileName)}
                  alt=""
                  sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 1 }}
                />
              ))}
            </Stack>
            <Button variant="outlined" component="label" size="small">
              {s.amenityGalleryAdd}
              <input
                hidden
                accept="image/jpeg,image/png,image/webp"
                type="file"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? [])
                  if (files.length === 0) return
                  void dispatch(
                    uploadLocationGalleryThunk({
                      projectId,
                      locationId: location._id,
                      files
                    })
                  )
                  event.target.value = ""
                }}
              />
            </Button>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="contained" onClick={() => void save()}>
              {s.save}
            </Button>
            {!location.isVerified && (
              <Button
                variant="outlined"
                onClick={() =>
                  void dispatch(
                    verifyLocationThunk({
                      projectId,
                      locationId: location._id
                    })
                  )
                }
              >
                {s.verify}
              </Button>
            )}
            <Button
              color="error"
              onClick={() =>
                void dispatch(
                  deleteLocationThunk({
                    projectId,
                    locationId: location._id
                  })
                ).then(onClose)
              }
            >
              {s.delete}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}
