import React, { useState, useEffect } from "react"
import { Button, Paper, Alert, Box, CircularProgress } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  getProjectByIdThunk,
  updateProjectThunk,
  uploadProjectImagesMultipleThunk,
  uploadProjectReelVideoThunk,
  uploadProjectPlaneThunk,
  uploadProjectBrochureThunk,
  removeProjectImageThunk,
  clearProjectErrorAct,
  setProjectErrorAct
} from "../slice/projects.slice"
import { fetchAmenitiesThunk } from "../slice/amenities.slice"
import { UpdateProjectDto } from "../types/project.types"
import { ProjectFormState } from "../types/project.types"
import ProjectFormCP from "./project-form.cp"
import { createAmenityThunk } from "../slice/amenities.slice"

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
  amenities?: { _id: string; title?: string }[]
  images?: string[]
}): ProjectFormState {
  const amenityIds = project.amenities?.map((a) => a._id) ?? []
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
    amenities: amenityIds,
    imageFiles: [],
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

  const handleUploadImages = async (files: File[]) => {
    if (!projectId || files.length === 0) return
    await dispatch(uploadProjectImagesMultipleThunk({ projectId, files })).unwrap()
  }

  const handleUploadReelVideo = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectReelVideoThunk({ projectId, file })).unwrap()
  }

  const handleUploadPlane = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectPlaneThunk({ projectId, file })).unwrap()
  }

  const handleUploadBrochure = async (file: File) => {
    if (!projectId) return
    await dispatch(uploadProjectBrochureThunk({ projectId, file })).unwrap()
  }

  const handleRemoveImage = async (imageName: string) => {
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
      amenities: form.amenities.length ? form.amenities : undefined
    }
    try {
      await dispatch(updateProjectThunk({ id: projectId, data: dto })).unwrap()
      if (form.imageFiles.length > 0) {
        await dispatch(
          uploadProjectImagesMultipleThunk({ projectId, files: form.imageFiles })
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
  const existingImages = (currentProject?.images ?? []).map((name) => ({
    name,
    url: name.startsWith("http")
      ? name
      : `${uploadsBaseUrl}/projects/${name.replace(/^\//, "")}`
  }))

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
          existingImages={existingImages}
          onAddAmenity={handleAddAmenity}
          projectId={projectId}
          onUploadImages={handleUploadImages}
          onRemoveImage={handleRemoveImage}
          existingReelVideoName={currentProject?.reelVideo ?? null}
          existingPlaneName={currentProject?.plane ?? null}
          existingBrochureName={currentProject?.brochure ?? null}
          onUploadReelVideo={handleUploadReelVideo}
          onUploadPlane={handleUploadPlane}
          onUploadBrochure={handleUploadBrochure}
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
