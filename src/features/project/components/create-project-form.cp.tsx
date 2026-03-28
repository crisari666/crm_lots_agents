import React, { useState, useEffect } from "react"
import { Button, Paper, Alert, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  createProjectThunk,
  uploadProjectCardImageThunk,
  uploadProjectHorizontalImagesMultipleThunk,
  uploadProjectImagesMultipleThunk,
  uploadProjectVerticalVideosMultipleThunk,
  uploadProjectReelVideoThunk,
  uploadProjectPlaneThunk,
  uploadProjectBrochureThunk,
  clearProjectErrorAct
} from "../slice/projects.slice"
import { fetchAmenitiesThunk } from "../slice/amenities.slice"
import { CreateProjectDto } from "../types/project.types"
import { ProjectFormState } from "../types/project.types"
import ProjectFormCP from "./project-form.cp"
import { createAmenityThunk } from "../slice/amenities.slice"
import { projectLotOptionsForApi } from "../utils/project-lot-options.util"
import {
  normalizeProjectSlugInput,
  isValidProjectSlugForApi,
  projectSlugForCreateApi
} from "../utils/project-slug.util"

const initialForm: ProjectFormState = {
  title: "",
  slug: "",
  description: "",
  location: "",
  city: "",
  state: "",
  country: "",
  lat: 0,
  lng: 0,
  priceSell: 0,
  commissionPercentage: 0,
  commissionValue: 0,
  separation: 0,
  lotOptions: [],
  amenities: [],
  cardProjectFile: null,
  horizontalImageFiles: [],
  imageFiles: [],
  verticalVideoFiles: [],
  reelVideoFile: null,
  planeFile: null,
  brochureFile: null
}

export default function CreateProjectFormCP() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state: RootState) => state.projects)
  const { amenities } = useAppSelector((state: RootState) => state.amenities)
  const [form, setForm] = useState<ProjectFormState>(initialForm)

  useEffect(() => {
    dispatch(fetchAmenitiesThunk())
    return () => {
      dispatch(clearProjectErrorAct())
    }
  }, [dispatch])

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
    if (!form.title.trim()) return
    const slugNorm = normalizeProjectSlugInput(form.slug ?? "")
    if (!isValidProjectSlugForApi(slugNorm)) return
    const lotOptionsPayload = projectLotOptionsForApi(form.lotOptions ?? [])
    const slugPayload = projectSlugForCreateApi(form.slug ?? "")
    const dto: CreateProjectDto = {
      title: form.title.trim(),
      ...(slugPayload ? { slug: slugPayload } : {}),
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
      separation: form.separation > 0 ? form.separation : undefined,
      lotOptions: lotOptionsPayload.length > 0 ? lotOptionsPayload : undefined,
      amenities: form.amenities.length ? form.amenities : undefined
    }
    try {
      const project = await dispatch(createProjectThunk(dto)).unwrap()
      const projectId = project._id
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

  const uploadsBaseUrl = import.meta.env.VITE_URL_RAG_AGENT_UPLOADS ?? ""

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
          onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          amenities={amenities}
          uploadsBaseUrl={uploadsBaseUrl}
          existingVerticalImages={[]}
          existingHorizontalImages={[]}
          existingHorizontalVideos={[]}
          onAddAmenity={handleAddAmenity}
        />
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="button" onClick={() => navigate("/dashboard/projects")}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              isLoading ||
              !form.title.trim() ||
              !isValidProjectSlugForApi(normalizeProjectSlugInput(form.slug ?? ""))
            }
          >
            Create Project
          </Button>
        </Box>
      </form>
    </Paper>
  )
}
