import React from "react"
import { Grid, Box } from "@mui/material"
import ProjectFormFieldsCP from "./project-form-fields.cp"
import ProjectImagePickerCP from "./project-image-picker.cp"
import { ProjectFormState } from "../types/project.types"
import { AmenityType } from "../types/amenity.types"

type ProjectFormCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  amenities: AmenityType[]
  existingImageUrls?: string[]
  disabled?: boolean
  onAddAmenity?: (title: string) => Promise<string | null>
  projectId?: string
  onUploadImage?: (file: File) => Promise<void>
}

export default function ProjectFormCP({
  form,
  onChange,
  amenities,
  existingImageUrls = [],
  disabled = false,
  onAddAmenity,
  projectId,
  onUploadImage
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
            existingUrls={existingImageUrls}
            onFilesChange={(imageFiles) => onChange({ imageFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadImage={onUploadImage}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
