import React from "react"
import { Grid, Box } from "@mui/material"
import ProjectFormFieldsCP from "./project-form-fields.cp"
import ProjectImagePickerCP, { ExistingProjectImage } from "./project-image-picker.cp"
import { ProjectFormState } from "../types/project.types"
import { AmenityType } from "../types/amenity.types"

type ProjectFormCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  amenities: AmenityType[]
  existingImages?: ExistingProjectImage[]
  disabled?: boolean
  onAddAmenity?: (title: string) => Promise<string | null>
  projectId?: string
  onUploadImage?: (file: File) => Promise<void>
  onRemoveImage?: (imageName: string) => Promise<void>
}

export default function ProjectFormCP({
  form,
  onChange,
  amenities,
  existingImages = [],
  disabled = false,
  onAddAmenity,
  projectId,
  onUploadImage,
  onRemoveImage
}: ProjectFormCPProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ProjectFormFieldsCP
            form={form}
            onChange={onChange}
            amenities={amenities}
            disabled={disabled}
            onAddAmenity={onAddAmenity}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProjectImagePickerCP
            files={form.imageFiles}
            existingImages={existingImages}
            onFilesChange={(imageFiles) => onChange({ imageFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadImage={onUploadImage}
            onRemoveImage={onRemoveImage}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
