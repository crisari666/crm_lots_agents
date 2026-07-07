import React from "react"
import { Grid, Box } from "@mui/material"
import ProjectFormFieldsCP from "./project-form-fields.cp"
import ProjectMediaPanelCP from "./project-media-panel.cp"
import { ExistingProjectImage } from "./project-image-picker.cp"
import { ExistingProjectVideo } from "./project-video-picker.cp"
import { ProjectFormState } from "../types/project.types"

type ProjectFormCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingCardProjectName?: string | null
  existingVerticalImages: ExistingProjectImage[]
  existingHorizontalImages: ExistingProjectImage[]
  existingHorizontalVideos: ExistingProjectVideo[]
  existingReelVideos: ExistingProjectVideo[]
  disabled?: boolean
  projectId?: string
  onUploadCard?: (file: File) => Promise<void>
  onRemoveCard?: () => Promise<void>
  onUploadVerticalImages?: (files: File[]) => Promise<void>
  onRemoveVerticalImage?: (imageName: string) => Promise<void>
  onUploadHorizontalImages?: (files: File[]) => Promise<void>
  onRemoveHorizontalImage?: (imageName: string) => Promise<void>
  existingPlaneName?: string | null
  existingBrochureName?: string | null
  onUploadReelVideos?: (files: File[]) => Promise<void>
  onRemoveReelVideo?: (videoName: string) => Promise<void>
  onUploadHorizontalVideos?: (files: File[]) => Promise<void>
  onRemoveHorizontalVideo?: (videoName: string) => Promise<void>
  onUploadPlane?: (file: File) => Promise<void>
  onRemovePlane?: () => Promise<void>
  onUploadBrochure?: (file: File) => Promise<void>
  onRemoveBrochure?: () => Promise<void>
}

export default function ProjectFormCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingCardProjectName = null,
  existingVerticalImages = [],
  existingHorizontalImages = [],
  existingHorizontalVideos = [],
  existingReelVideos = [],
  disabled = false,
  projectId,
  onUploadCard,
  onRemoveCard,
  onUploadVerticalImages,
  onRemoveVerticalImage,
  onUploadHorizontalImages,
  onRemoveHorizontalImage,
  existingPlaneName,
  existingBrochureName,
  onUploadReelVideos,
  onRemoveReelVideo,
  onUploadHorizontalVideos,
  onRemoveHorizontalVideo,
  onUploadPlane,
  onRemovePlane,
  onUploadBrochure,
  onRemoveBrochure,
}: ProjectFormCPProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ProjectFormFieldsCP form={form} onChange={onChange} disabled={disabled} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProjectMediaPanelCP
            form={form}
            onChange={onChange}
            uploadsBaseUrl={uploadsBaseUrl}
            existingCardProjectName={existingCardProjectName}
            existingVerticalImages={existingVerticalImages}
            existingHorizontalImages={existingHorizontalImages}
            existingHorizontalVideos={existingHorizontalVideos}
            existingReelVideos={existingReelVideos}
            disabled={disabled}
            projectId={projectId}
            onUploadCard={onUploadCard}
            onRemoveCard={onRemoveCard}
            onUploadVerticalImages={onUploadVerticalImages}
            onRemoveVerticalImage={onRemoveVerticalImage}
            onUploadHorizontalImages={onUploadHorizontalImages}
            onRemoveHorizontalImage={onRemoveHorizontalImage}
            existingPlaneName={existingPlaneName}
            existingBrochureName={existingBrochureName}
            onUploadReelVideos={onUploadReelVideos}
            onRemoveReelVideo={onRemoveReelVideo}
            onUploadHorizontalVideos={onUploadHorizontalVideos}
            onRemoveHorizontalVideo={onRemoveHorizontalVideo}
            onUploadPlane={onUploadPlane}
            onRemovePlane={onRemovePlane}
            onUploadBrochure={onUploadBrochure}
            onRemoveBrochure={onRemoveBrochure}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
