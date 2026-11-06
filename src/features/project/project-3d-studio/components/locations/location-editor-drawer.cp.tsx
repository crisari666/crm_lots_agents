import React, { useEffect, useRef, useState } from "react"
import Close from "@mui/icons-material/Close"
import ExpandMore from "@mui/icons-material/ExpandMore"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
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
  setLocationLinkDraftAct,
  setRelocatingLocationIdAct,
  updateAssetThunk,
  updateLocationThunk,
  uploadAssetThunk,
  uploadLocationGalleryThunk,
  verifyLocationThunk
} from "../../slice/project-3d-studio.slice"
import type {
  ExperienceRoadLineType,
  ProjectLocationImportance,
  ProjectLocationType
} from "../../types/project-experience.types"
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
  const libraryResources = useAppSelector(
    (state: RootState) => state.project3dStudio.resources
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
  const [linkedResourceId, setLinkedResourceId] = useState("")
  const [routeColor, setRouteColor] = useState("#e07a3d")
  const [routeLine, setRouteLine] = useState<ExperienceRoadLineType>("solid")
  const [showRoute, setShowRoute] = useState(true)
  const [modelAltitude, setModelAltitude] = useState("0")
  const [modelPitch, setModelPitch] = useState(0)
  const [modelHeading, setModelHeading] = useState(0)
  const [modelRoll, setModelRoll] = useState(0)
  const [galleryRemoveFile, setGalleryRemoveFile] = useState<string | null>(null)
  const linkedResourceIdRef = useRef(linkedResourceId)
  linkedResourceIdRef.current = linkedResourceId
  const modelAltitudeRef = useRef(modelAltitude)
  const modelRotationRef = useRef<[number, number, number]>([0, 0, 0])
  modelAltitudeRef.current = modelAltitude
  modelRotationRef.current = [modelPitch, modelHeading, modelRoll]
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
  const previousLocationIdRef = useRef<string | null>(null)
  const point = location ? readPointCoordinates(location) : null
  const pointKey = point ? `${point.longitude},${point.latitude}` : ""
  const isRelocating =
    activeTool === "relocateLocation" && relocatingLocationId === locationId

  useEffect(() => {
    if (!location) return
    setName(location.name)
    setDescription(location.description ?? "")
    setSubtitle(location.subtitle ?? "")
    setCategoryKey(location.categoryKey ?? "")
    setPanoramaAssetId(location.panoramaAssetId ?? "")
    setLinkedResourceId(location.linkedResourceId ?? "")
    setRouteColor(location.routeColor || "#e07a3d")
    setRouteLine(location.routeLine || "solid")
    setShowRoute(location.showRoute !== false)
    const savedRotation = location.modelRotation ?? [0, 0, 0]
    const savedAltitude =
      location.modelAltitude != null ? String(location.modelAltitude) : "0"
    setModelAltitude(savedAltitude)
    setModelPitch(Number(savedRotation[0]) || 0)
    setModelHeading(Number(savedRotation[1]) || 0)
    setModelRoll(Number(savedRotation[2]) || 0)
    modelAltitudeRef.current = savedAltitude
    modelRotationRef.current = [
      Number(savedRotation[0]) || 0,
      Number(savedRotation[1]) || 0,
      Number(savedRotation[2]) || 0
    ]
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
    const nextPoint = readPointCoordinates(location)
    if (!nextPoint) return
    setLatitude(nextPoint.latitude)
    setLongitude(nextPoint.longitude)
    setCoordError("")
    const resourceId = linkedResourceIdRef.current
    if (!resourceId) return
    dispatch(
      setLocationLinkDraftAct({
        locationId,
        linkedResourceId: resourceId,
        longitude: Number(nextPoint.longitude),
        latitude: Number(nextPoint.latitude),
        modelAltitude: Number(modelAltitudeRef.current) || 0,
        modelRotation: modelRotationRef.current
      })
    )
  }, [dispatch, location, locationId, pointKey])
  useEffect(() => {
    const previousLocationId = previousLocationIdRef.current
    previousLocationIdRef.current = locationId
    if (previousLocationId == null || previousLocationId === locationId) return
    dispatch(setLocationLinkDraftAct(null))
  }, [dispatch, locationId])

  if (!location) return null

  const publishLinkDraft = (
    resourceId: string,
    latText: string,
    lngText: string
  ): void => {
    if (location.geometry.type !== "Point") return
    const parsedLatitude = Number(latText)
    const parsedLongitude = Number(lngText)
    const saved = readPointCoordinates(location)
    const nextLatitude = isValidLatitude(parsedLatitude)
      ? parsedLatitude
      : Number(saved?.latitude)
    const nextLongitude = isValidLongitude(parsedLongitude)
      ? parsedLongitude
      : Number(saved?.longitude)
    if (!Number.isFinite(nextLatitude) || !Number.isFinite(nextLongitude)) return
    dispatch(
      setLocationLinkDraftAct({
        locationId,
        linkedResourceId: resourceId,
        longitude: nextLongitude,
        latitude: nextLatitude,
        modelAltitude: Number(modelAltitudeRef.current) || 0,
        modelRotation: modelRotationRef.current
      })
    )
  }

  const publishModelPose = (
    altitude: string,
    rotation: [number, number, number]
  ): void => {
    modelAltitudeRef.current = altitude
    modelRotationRef.current = rotation
    setModelAltitude(altitude)
    setModelPitch(rotation[0])
    setModelHeading(rotation[1])
    setModelRoll(rotation[2])
    publishLinkDraft(linkedResourceIdRef.current, latitude, longitude)
  }

  const confirmRemoveGalleryImage = (): void => {
    const fileName = galleryRemoveFile
    if (!fileName) return
    const gallery = (location.media?.gallery ?? []).filter((name) => name !== fileName)
    setGalleryRemoveFile(null)
    void dispatch(
      updateLocationThunk({
        projectId,
        locationId: location._id,
        data: { gallery }
      })
    )
  }

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
    const savedPoint = isPoint ? readPointCoordinates(location) : null
    const pointMoved =
      isPoint &&
      (savedPoint == null ||
        savedPoint.latitude !== String(parsedLatitude) ||
        savedPoint.longitude !== String(parsedLongitude))
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
          linkedResourceId,
          linkedAssetId: "",
          modelAltitude: Number(modelAltitude) || 0,
          modelRotation: [modelPitch, modelHeading, modelRoll],
          routeColor,
          routeLine,
          showRoute,
          importance,
          isVisible,
          estimatedTravelMinutes:
            estimatedTravelMinutes.trim() === ""
              ? undefined
              : Number(estimatedTravelMinutes),
          ...(pointMoved
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
          <FormControl size="small" fullWidth>
            <InputLabel>{s.locationSource}</InputLabel>
            <Select
              label={s.locationSource}
              value={linkedResourceId}
              onChange={(event) => {
                const nextId = String(event.target.value)
                const nextResource = libraryResources.find(
                  (resource) => resource._id === nextId
                )
                setLinkedResourceId(nextId)
                if (!nextId || nextResource?.type !== "model_3d") {
                  modelAltitudeRef.current = "0"
                  modelRotationRef.current = [0, 0, 0]
                  setModelAltitude("0")
                  setModelPitch(0)
                  setModelHeading(0)
                  setModelRoll(0)
                }
                publishLinkDraft(nextId, latitude, longitude)
              }}
            >
              <MenuItem value="">{s.locationSourceNone}</MenuItem>
              {libraryResources.map((resource) => (
                <MenuItem key={resource._id} value={resource._id}>
                  {resource.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {libraryResources.some(
            (resource) =>
              resource._id === linkedResourceId && resource.type === "model_3d"
          ) && (
            <Stack spacing={1}>
              <TextField
                label={s.assetsAltitude}
                size="small"
                type="number"
                value={modelAltitude}
                onChange={(event) =>
                  publishModelPose(event.target.value, [
                    modelPitch,
                    modelHeading,
                    modelRoll
                  ])
                }
                fullWidth
              />
              <TextField
                label={s.assetsRotationHeading}
                size="small"
                type="number"
                value={modelHeading}
                onChange={(event) =>
                  publishModelPose(modelAltitude, [
                    modelPitch,
                    Number(event.target.value) || 0,
                    modelRoll
                  ])
                }
                fullWidth
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  label={s.assetsRotationPitch}
                  size="small"
                  type="number"
                  value={modelPitch}
                  onChange={(event) =>
                    publishModelPose(modelAltitude, [
                      Number(event.target.value) || 0,
                      modelHeading,
                      modelRoll
                    ])
                  }
                  fullWidth
                />
                <TextField
                  label={s.assetsRotationRoll}
                  size="small"
                  type="number"
                  value={modelRoll}
                  onChange={(event) =>
                    publishModelPose(modelAltitude, [
                      modelPitch,
                      modelHeading,
                      Number(event.target.value) || 0
                    ])
                  }
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    publishModelPose(modelAltitude, [
                      modelPitch,
                      modelHeading - 15,
                      modelRoll
                    ])
                  }
                  sx={{ flex: 1 }}
                >
                  −15°
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    publishModelPose(modelAltitude, [
                      modelPitch,
                      modelHeading + 15,
                      modelRoll
                    ])
                  }
                  sx={{ flex: 1 }}
                >
                  +15°
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => publishModelPose("0", [0, 0, 0])}
                  sx={{ flex: 1 }}
                >
                  0°
                </Button>
              </Stack>
            </Stack>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={showRoute}
                onChange={(event) => setShowRoute(event.target.checked)}
              />
            }
            label={s.locationShowRoute}
          />
          {showRoute && (
          <>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="input"
              type="color"
              aria-label={s.locationRouteColor}
              value={routeColor}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setRouteColor(event.target.value)
              }
              sx={{
                width: 40,
                height: 36,
                p: 0.25,
                border: "1px solid rgba(226,232,240,0.24)",
                borderRadius: 1,
                bgcolor: "transparent",
                cursor: "pointer"
              }}
            />
            <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
              {s.locationRouteColor}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {s.locationRouteLine}
          </Typography>
          <Stack direction="row" spacing={1}>
            {(
              [
                ["solid", s.roadsStyleLineSolid],
                ["double", s.roadsStyleLineDouble],
                ["dashed", s.roadsStyleLineDashed]
              ] as const
            ).map(([line, label]) => (
              <Button
                key={line}
                size="small"
                variant={routeLine === line ? "contained" : "outlined"}
                aria-pressed={routeLine === line}
                onClick={() => setRouteLine(line)}
                sx={{ flex: 1 }}
              >
                {label}
              </Button>
            ))}
          </Stack>
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
                  const nextLatitude = e.target.value
                  setLatitude(nextLatitude)
                  setCoordError("")
                  publishLinkDraft(linkedResourceId, nextLatitude, longitude)
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
                  const nextLongitude = e.target.value
                  setLongitude(nextLongitude)
                  setCoordError("")
                  publishLinkDraft(linkedResourceId, latitude, nextLongitude)
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
              {(location.media?.gallery ?? []).map((fileName, index) => (
                <Box
                  key={fileName}
                  sx={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}
                >
                  <Box
                    component="img"
                    src={buildExperienceAssetUrl(fileName)}
                    alt={`${s.amenityGalleryImage} ${index + 1}`}
                    sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 1 }}
                  />
                  <IconButton
                    aria-label={`${s.amenityGalleryRemove} ${index + 1}`}
                    onClick={() => setGalleryRemoveFile(fileName)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 44,
                      height: 44,
                      color: "#f8fafc",
                      bgcolor: "rgba(15,23,42,0.72)",
                      "&:hover": { bgcolor: "rgba(15,23,42,0.88)" }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
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
      <Dialog
        open={galleryRemoveFile != null}
        onClose={() => setGalleryRemoveFile(null)}
        aria-labelledby="remove-gallery-image-title"
      >
        <DialogTitle id="remove-gallery-image-title">
          {s.amenityGalleryRemove}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{s.amenityGalleryRemoveConfirm}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGalleryRemoveFile(null)}>{s.cancel}</Button>
          <Button color="error" onClick={confirmRemoveGalleryImage}>
            {s.amenityGalleryRemove}
          </Button>
        </DialogActions>
      </Dialog>
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
