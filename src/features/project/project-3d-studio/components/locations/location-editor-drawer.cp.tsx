import React, { useEffect, useRef, useState } from "react"
import ExpandMore from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
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
  updateAssetThunk,
  updateLocationThunk,
  uploadAssetThunk,
  uploadLocationGalleryThunk,
  verifyLocationThunk
} from "../../slice/project-3d-studio.slice"
import type { ProjectLocationImportance, ProjectLocationType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import { buildExperienceAssetUrl } from "../../utils/experience-asset-url.util"
import { compressPanoramaFile } from "../../utils/compress-panorama-file.util"
import { getLocationLngLat } from "../../utils/location-lng-lat.util"

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

type PlaceSectionId = "data" | "place" | "publish" | "gallery"

function PlaceSection(props: {
  id: PlaceSectionId
  title: string
  expanded: boolean
  onToggle: (id: PlaceSectionId) => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <Accordion
      disableGutters
      expanded={props.expanded}
      onChange={() => props.onToggle(props.id)}
      sx={{
        bgcolor: "transparent",
        color: "inherit",
        boxShadow: "none",
        "&:before": { display: "none" },
        borderBottom: "1px solid rgba(226,232,240,0.12)"
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: "#94a3b8" }} />}
        sx={{ px: 0, minHeight: 44 }}
      >
        <Typography variant="subtitle2">{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
        <Stack spacing={1.5}>{props.children}</Stack>
      </AccordionDetails>
    </Accordion>
  )
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
  const panoramaAssetsRef = useRef(panoramaAssets)
  panoramaAssetsRef.current = panoramaAssets
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
  const [isPanorama, setIsPanorama] = useState(false)
  const [rotHeading, setRotHeading] = useState(0)
  const [cameraHeight, setCameraHeight] = useState("")
  const [importance, setImportance] =
    useState<ProjectLocationImportance>("medium")
  const [isVisible, setIsVisible] = useState(true)
  const [estimatedTravelMinutes, setEstimatedTravelMinutes] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [coordError, setCoordError] = useState("")
  const [openSection, setOpenSection] = useState<PlaceSectionId | null>("data")
  const isPoint = location?.geometry.type === "Point"
  const locationId = location?._id ?? ""
  const pointKey =
    location?.geometry.type === "Point"
      ? `${location.geometry.coordinates[0]},${location.geometry.coordinates[1]}`
      : ""
  const isRelocating =
    activeTool === "relocateLocation" && relocatingLocationId === locationId

  useEffect(() => {
    if (!location) return
    setName(location.name)
    setDescription(location.description ?? "")
    setSubtitle(location.subtitle ?? "")
    setCategoryKey(location.categoryKey ?? "")
    setPanoramaAssetId(location.panoramaAssetId ?? "")
    setIsPanorama(Boolean(location.panoramaAssetId))
    const linked = panoramaAssetsRef.current.find(
      (asset) => asset._id === (location.panoramaAssetId ?? "")
    )
    setRotHeading(Number(linked?.transform.rotation?.[1]) || 0)
    setCameraHeight(
      linked?.position.altitude != null ? String(linked.position.altitude) : ""
    )
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
    setOpenSection("data")
  }, [locationId])

  useEffect(() => {
    if (!isRelocating) return
    setOpenSection("place")
  }, [isRelocating])

  useEffect(() => {
    if (!location || !pointKey) return
    const point = readPointCoordinates(location)
    if (!point) return
    setLatitude(point.latitude)
    setLongitude(point.longitude)
    setCoordError("")
  }, [location, locationId, pointKey])

  if (!location) return null

  const save = async () => {
    const parsedLatitude = Number(latitude)
    const parsedLongitude = Number(longitude)
    if (
      isPoint &&
      (!isValidLatitude(parsedLatitude) || !isValidLongitude(parsedLongitude))
    ) {
      setCoordError(s.locationCoordInvalid)
      setOpenSection("place")
      return
    }
    const point = isPoint
      ? { lng: parsedLongitude, lat: parsedLatitude }
      : getLocationLngLat(location.geometry)
    const nextPanoramaId = isPanorama ? panoramaAssetId : ""
    const altitude =
      cameraHeight.trim() === "" ? null : Number(cameraHeight)
    if (nextPanoramaId && point) {
      const linked = panoramaAssets.find((asset) => asset._id === nextPanoramaId)
      await dispatch(
        updateAssetThunk({
          projectId,
          assetId: nextPanoramaId,
          data: {
            position: {
              longitude: point.lng,
              latitude: point.lat,
              altitude
            },
            transform: {
              rotation: [0, Number(rotHeading) || 0, 0],
              scale: linked?.transform.scale || 1
            }
          }
        })
      ).unwrap()
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
          panoramaAssetId: nextPanoramaId,
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

  const linkedPanorama = panoramaAssets.find(
    (asset) => asset._id === panoramaAssetId
  )
  const panoramaThumb = linkedPanorama
    ? buildExperienceAssetUrl(
        linkedPanorama.thumbnailFileName || linkedPanorama.fileName
      )
    : ""

  const uploadPanorama = async (file: File): Promise<void> => {
    const parsedLatitude = Number(latitude)
    const parsedLongitude = Number(longitude)
    const point =
      isPoint &&
      isValidLatitude(parsedLatitude) &&
      isValidLongitude(parsedLongitude)
        ? { lng: parsedLongitude, lat: parsedLatitude }
        : getLocationLngLat(location.geometry)
    if (!point) {
      setCoordError(s.locationCoordInvalid)
      return
    }
    const compressed = await compressPanoramaFile(file)
    const altitude = cameraHeight.trim() === "" ? null : Number(cameraHeight)
    const created = await dispatch(
      uploadAssetThunk({
        projectId,
        file: compressed,
        type: "panorama",
        name: name || compressed.name,
        longitude: point.lng,
        latitude: point.lat,
        altitude
      })
    ).unwrap()
    const nextId = String(created._id)
    setPanoramaAssetId(nextId)
    setIsPanorama(true)
    await dispatch(
      updateAssetThunk({
        projectId,
        assetId: nextId,
        data: {
          transform: {
            rotation: [0, Number(rotHeading) || 0, 0],
            scale: created.transform?.scale || 1
          }
        }
      })
    ).unwrap()
    await dispatch(
      updateLocationThunk({
        projectId,
        locationId: location._id,
        data: { panoramaAssetId: nextId }
      })
    )
  }

  const toggleSection = (id: PlaceSectionId): void => {
    setOpenSection((current) => (current === id ? null : id))
  }

  return (
    <Drawer
      anchor="right"
      open={Boolean(location)}
      onClose={onClose}
      hideBackdrop={isRelocating}
      ModalProps={{
        hideBackdrop: isRelocating,
        disableEnforceFocus: isRelocating,
        disableAutoFocus: isRelocating,
        sx: isRelocating ? { pointerEvents: "none" } : undefined
      }}
      PaperProps={{
        sx: {
          width: 360,
          bgcolor: "#0f172a",
          color: "#e2e8f0",
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6">
          {amenityCategories.find((row) => row.key === location.categoryKey)?.label ??
            location.name}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
        <PlaceSection
          id="data"
          title={s.locationSectionData}
          expanded={openSection === "data"}
          onToggle={toggleSection}
        >
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
          <TextField
            label={s.description}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </PlaceSection>
        {isPoint && (
          <PlaceSection
            id="place"
            title={s.locationSectionPlace}
            expanded={openSection === "place"}
            onToggle={toggleSection}
          >
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
          </PlaceSection>
        )}
        <PlaceSection
          id="publish"
          title={s.locationSectionPublish}
          expanded={openSection === "publish"}
          onToggle={toggleSection}
        >
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
        </PlaceSection>
        <PlaceSection
          id="gallery"
          title={s.amenityGallery}
          expanded={openSection === "gallery"}
          onToggle={toggleSection}
        >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPanorama}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setIsPanorama(checked)
                    if (checked) {
                      setOpenSection("gallery")
                      return
                    }
                    setPanoramaAssetId("")
                    void dispatch(
                      updateLocationThunk({
                        projectId,
                        locationId: location._id,
                        data: { panoramaAssetId: "" }
                      })
                    )
                  }}
                />
              }
              label={s.locationPanorama}
            />
            <Stack direction="row" spacing={1} sx={{ mb: 1, overflowX: "auto" }}>
              {panoramaThumb && (
                <Box
                  component="img"
                  src={panoramaThumb}
                  alt={s.locationPanorama}
                  sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 1 }}
                />
              )}
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
                multiple={!isPanorama}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? [])
                  event.target.value = ""
                  if (files.length === 0) return
                  if (isPanorama) {
                    void uploadPanorama(files[0])
                    return
                  }
                  void dispatch(
                    uploadLocationGalleryThunk({
                      projectId,
                      locationId: location._id,
                      files
                    })
                  )
                }}
              />
            </Button>
            {isPanorama && (
              <Stack spacing={1} sx={{ mt: 1 }}>
                <TextField
                  label={s.assetsPanoramaHeading}
                  size="small"
                  type="number"
                  value={rotHeading}
                  onChange={(event) => setRotHeading(Number(event.target.value))}
                  inputProps={{ min: 0, max: 360, step: 1 }}
                  fullWidth
                />
                <TextField
                  label={s.assetsPanoramaAltitude}
                  size="small"
                  type="number"
                  value={cameraHeight}
                  onChange={(event) => setCameraHeight(event.target.value)}
                  helperText={s.assetsPanoramaCompress}
                  fullWidth
                />
              </Stack>
            )}
        </PlaceSection>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ p: 2, borderTop: "1px solid rgba(226,232,240,0.12)" }}
      >
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
    </Drawer>
  )
}
