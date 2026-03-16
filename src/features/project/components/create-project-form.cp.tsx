import React, { useState, useEffect } from "react"
import { Button, Paper, Alert, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  createProjectThunk,
  uploadProjectImageThunk,
  clearProjectErrorAct
} from "../slice/projects.slice"
import { fetchAmenitiesThunk } from "../slice/amenities.slice"
import { CreateProjectDto } from "../types/project.types"
import { ProjectFormState } from "../types/project.types"
import ProjectFormCP from "./project-form.cp"
import { createAmenityThunk } from "../slice/amenities.slice"

const initialForm: ProjectFormState = {
  title: "",
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
  amenities: [],
  imageFiles: []
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
    const dto: CreateProjectDto = {
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
      const project = await dispatch(createProjectThunk(dto)).unwrap()
      const projectId = project._id
      for (const file of form.imageFiles) {
        await dispatch(uploadProjectImageThunk({ projectId, file })).unwrap()
      }
      navigate("/dashboard/projects")
    } catch {
      // error in state
    }
  }

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
          onAddAmenity={handleAddAmenity}
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
            Create Project
          </Button>
        </Box>
      </form>
    </Paper>
  )
}
