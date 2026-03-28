import React, { useState, useEffect } from "react"
import { Button, Paper, Alert, Box, CircularProgress } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  getProjectByIdThunk,
  updateProjectThunk,
  uploadProjectCardImageThunk,
  removeProjectCardImageThunk,
  uploadProjectHorizontalImagesMultipleThunk,
  uploadProjectImagesMultipleThunk,
  uploadProjectVerticalVideosMultipleThunk,
  uploadProjectReelVideoThunk,
  uploadProjectPlaneThunk,
  uploadProjectBrochureThunk,
  removeProjectImageThunk,
  removeProjectHorizontalImageThunk,
  removeProjectVerticalVideoThunk,
  removeProjectReelVideoThunk,
  removeProjectPlaneThunk,
  removeProjectBrochureThunk,
  clearProjectErrorAct,
  setProjectErrorAct
} from "../slice/projects.slice"
import { fetchAmenitiesThunk } from "../slice/amenities.slice"
import { UpdateProjectDto } from "../types/project.types"
import { ProjectFormState } from "../types/project.types"
import ProjectFormCP from "./project-form.cp"
import { createAmenityThunk } from "../slice/amenities.slice"
import { ExistingProjectImage } from "./project-image-picker.cp"
import { ExistingProjectVideo } from "./project-video-picker.cp"
import { buildProjectAssetUrl } from "../utils/project-uploads.util"
import { projectLotOptionsForApi } from "../utils/project-lot-options.util"
import type { ProjectLotOption } from "../types/project.types"

function namesToExistingImages(names: string[] | undefined, uploadsBaseUrl: string): ExistingProjectImage[] {
  return (names ?? []).map((name) => ({
    name,
    url: name.startsWith("http") ? name : buildProjectAssetUrl(uploadsBaseUrl, name)
  }))
}

function namesToExistingVideos(names: string[] | undefined, uploadsBaseUrl: string): ExistingProjectVideo[] {
  return (names ?? []).map((name) => ({
    name,
    url: name.startsWith("http") ? name : buildProjectAssetUrl(uploadsBaseUrl, name)
  }))
}

function projectToFormState(project: {
  title: string
  description?: string
  location: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
  priceSell: number
  commissionPercentage: number
  commissionValue: number
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenities?: { _id: string; title?: string }[]
}): ProjectFormState {
  const amenityIds = project.amenities?.map((a) => a._id) ?? []
  const lotOptionsFromApi = project.lotOptions ?? []
  return {
    title: project.title,
    description: project.description ?? "",
    location: project.location,
    city: project.city ?? "",
    state: project.state ?? "",
    country: project.country ?? "",
    lat: project.lat,
    lng: project.lng,
    priceSell: project.priceSell,
    commissionPercentage: project.commissionPercentage,
    commissionValue: project.commissionValue,
    separation: project.separation ?? 0,
    lotOptions: lotOptionsFromApi.map((o) => ({
      area: o.area ?? 0,
      price: o.price ?? 0
    })),
    amenities: amenityIds,
    cardProjectFile: null,
    horizontalImageFiles: [],
    imageFiles: [],
    verticalVideoFiles: [],
    reelVideoFile: null,
    planeFile: null,
    brochureFile: null
  }
}

export default function EditProjectFormCP() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentProject, isLoading, error } = useAppSelector((state: RootState) => state.projects)
  const { amenities } = useAppSelector((state: RootState) => state.amenities)
  const [form, setForm] = useState<ProjectFormState | null>(null)

  useEffect(() => {
    if (projectId) dispatch(getProjectByIdThunk(projectId))
    dispatch(fetchAmenitiesThunk())
    return () => {
      dispatch(clearProjectErrorAct())
    }
  }, [dispatch, projectId])

  useEffect(() => {
    if (currentProject && currentProject._id === projectId) {
      setForm(projectToFormState(currentProject))
    }
  }, [currentProject, projectId])

  const handleUploadCard = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectCardImageThunk({ projectId, file })).unwrap()
  }

  const handleRemoveCard = async () => {
    if (!projectId) return
    try {
      await dispatch(removeProjectCardImageThunk({ projectId })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto o imagen de tarjeta no encontrados." : "No se pudo eliminar la imagen de tarjeta."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleUploadVerticalImages = async (files: File[]) => {
    if (!projectId || files.length === 0) return
    await dispatch(uploadProjectImagesMultipleThunk({ projectId, files })).unwrap()
  }

  const handleUploadHorizontalImages = async (files: File[]) => {
    if (!projectId || files.length === 0) return
    await dispatch(uploadProjectHorizontalImagesMultipleThunk({ projectId, files })).unwrap()
  }

  const handleUploadReelVideo = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectReelVideoThunk({ projectId, file })).unwrap()
  }

  const handleUploadHorizontalVideos = async (files: File[]) => {
    if (!projectId || files.length === 0) return
    await dispatch(uploadProjectVerticalVideosMultipleThunk({ projectId, files })).unwrap()
  }

  const handleUploadPlane = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectPlaneThunk({ projectId, file })).unwrap()
  }

  const handleUploadBrochure = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectBrochureThunk({ projectId, file })).unwrap()
  }

  const handleRemoveReelVideo = async () => {
    if (!projectId) return
    try {
      await dispatch(removeProjectReelVideoThunk({ projectId })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto no encontrado." : "No se pudo eliminar el reel video."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleRemovePlane = async () => {
    if (!projectId) return
    try {
      await dispatch(removeProjectPlaneThunk({ projectId })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto no encontrado." : "No se pudo eliminar el plano."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleRemoveBrochure = async () => {
    if (!projectId) return
    try {
      await dispatch(removeProjectBrochureThunk({ projectId })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto no encontrado." : "No se pudo eliminar el brochure."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleRemoveVerticalImage = async (imageName: string) => {
    if (!projectId) return
    try {
      await dispatch(removeProjectImageThunk({ projectId, imageName })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto o imagen no encontrados." : "No se pudo eliminar la imagen."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleRemoveHorizontalImage = async (imageName: string) => {
    if (!projectId) return
    try {
      await dispatch(removeProjectHorizontalImageThunk({ projectId, imageName })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto o imagen no encontrados." : "No se pudo eliminar la imagen horizontal."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleRemoveHorizontalVideo = async (videoName: string) => {
    if (!projectId) return
    try {
      await dispatch(removeProjectVerticalVideoThunk({ projectId, videoName })).unwrap()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ""
      const message =
        msg.includes("404") ? "Proyecto o video no encontrados." : "No se pudo eliminar el video."
      dispatch(clearProjectErrorAct())
      dispatch(setProjectErrorAct(message))
      await dispatch(getProjectByIdThunk(projectId))
    }
  }

  const handleAddAmenity = async (title: string): Promise<string | null> => {
    try {
      const result = await dispatch(
        createAmenityThunk({ title: title.trim() })
      ).unwrap()
      return result._id
    } catch {
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !projectId || !form.title.trim()) return
    const dto: UpdateProjectDto = {
      title: form.title.trim(),
      description: form.description || undefined,
      location: form.location.trim(),
      city: form.city?.trim() || undefined,
      state: form.state?.trim() || undefined,
      country: form.country?.trim() || undefined,
      lat: form.lat,
      lng: form.lng,
      priceSell: form.priceSell,
      commissionPercentage: form.commissionPercentage,
      commissionValue: (form.priceSell * form.commissionPercentage) / 100,
      separation: form.separation,
      lotOptions: projectLotOptionsForApi(form.lotOptions ?? []),
      amenities: form.amenities.length ? form.amenities : undefined
    }
    try {
      await dispatch(updateProjectThunk({ id: projectId, data: dto })).unwrap()
      if (form.cardProjectFile) {
        await dispatch(uploadProjectCardImageThunk({ projectId, file: form.cardProjectFile })).unwrap()
      }
      if (form.horizontalImageFiles.length > 0) {
        await dispatch(
          uploadProjectHorizontalImagesMultipleThunk({ projectId, files: form.horizontalImageFiles })
        ).unwrap()
      }
      if (form.imageFiles.length > 0) {
        await dispatch(
          uploadProjectImagesMultipleThunk({ projectId, files: form.imageFiles })
        ).unwrap()
      }
      if (form.verticalVideoFiles.length > 0) {
        await dispatch(
          uploadProjectVerticalVideosMultipleThunk({ projectId, files: form.verticalVideoFiles })
        ).unwrap()
      }
      if (form.reelVideoFile) {
        await dispatch(
          uploadProjectReelVideoThunk({ projectId, file: form.reelVideoFile })
        ).unwrap()
      }
      if (form.planeFile) {
        await dispatch(uploadProjectPlaneThunk({ projectId, file: form.planeFile })).unwrap()
      }
      if (form.brochureFile) {
        await dispatch(
          uploadProjectBrochureThunk({ projectId, file: form.brochureFile })
        ).unwrap()
      }
      navigate("/dashboard/projects")
    } catch {
      // error in state
    }
  }

  if (!projectId) {
    return (
      <Alert severity="error" onClose={() => navigate("/dashboard/projects")}>
        Missing project ID
      </Alert>
    )
  }

  if (form === null && !error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (form === null) {
    return (
      <Alert severity="error" onClose={() => navigate("/dashboard/projects")}>
        {error ?? "Project not found"}
      </Alert>
    )
  }

  const uploadsBaseUrl = import.meta.env.VITE_URL_RAG_AGENT_UPLOADS ?? ""
  const existingVerticalImages = namesToExistingImages(currentProject?.images, uploadsBaseUrl)
  const existingHorizontalImages = namesToExistingImages(currentProject?.horizontalImages, uploadsBaseUrl)
  const existingHorizontalVideos = namesToExistingVideos(currentProject?.verticalVideos, uploadsBaseUrl)

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearProjectErrorAct())}>
            {error}
          </Alert>
        )}
        <ProjectFormCP
          form={form}
          onChange={(updates) => setForm((prev) => (prev ? { ...prev, ...updates } : null))}
          amenities={amenities}
          uploadsBaseUrl={uploadsBaseUrl}
          existingCardProjectName={currentProject?.cardProject ?? null}
          existingVerticalImages={existingVerticalImages}
          existingHorizontalImages={existingHorizontalImages}
          existingHorizontalVideos={existingHorizontalVideos}
          onAddAmenity={handleAddAmenity}
          projectId={projectId}
          onUploadCard={handleUploadCard}
          onRemoveCard={handleRemoveCard}
          onUploadVerticalImages={handleUploadVerticalImages}
          onRemoveVerticalImage={handleRemoveVerticalImage}
          onUploadHorizontalImages={handleUploadHorizontalImages}
          onRemoveHorizontalImage={handleRemoveHorizontalImage}
          existingReelVideoName={currentProject?.reelVideo ?? null}
          existingPlaneName={currentProject?.plane ?? null}
          existingBrochureName={currentProject?.brochure ?? null}
          onUploadReelVideo={handleUploadReelVideo}
          onRemoveReelVideo={handleRemoveReelVideo}
          onUploadHorizontalVideos={handleUploadHorizontalVideos}
          onRemoveHorizontalVideo={handleRemoveHorizontalVideo}
          onUploadPlane={handleUploadPlane}
          onRemovePlane={handleRemovePlane}
          onUploadBrochure={handleUploadBrochure}
          onRemoveBrochure={handleRemoveBrochure}
        />
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="button" onClick={() => navigate("/dashboard/projects")}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !form.title.trim()}
          >
            Update Project
          </Button>
        </Box>
      </form>
    </Paper>
  )
}
