import React, { useState } from "react"
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import ProjectImagePickerCP, { ExistingProjectImage } from "./project-image-picker.cp"
import ProjectCardImageCP from "./project-card-image.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectImagesTabsCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingCardProjectName?: string | null
  existingVerticalImages: ExistingProjectImage[]
  existingHorizontalImages: ExistingProjectImage[]
  disabled?: boolean
  projectId?: string
  onUploadCard?: (file: File) => Promise<void>
  onRemoveCard?: () => Promise<void>
  onUploadVerticalImages?: (files: File[]) => Promise<void>
  onRemoveVerticalImage?: (imageName: string) => Promise<void>
  onUploadHorizontalImages?: (files: File[]) => Promise<void>
  onRemoveHorizontalImage?: (imageName: string) => Promise<void>
  onOpenImagesPreview: (items: ProjectPreviewItem[], startIndex: number) => void
}

export default function ProjectImagesTabsCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingCardProjectName = null,
  existingVerticalImages,
  existingHorizontalImages,
  disabled = false,
  projectId,
  onUploadCard,
  onRemoveCard,
  onUploadVerticalImages,
  onRemoveVerticalImage,
  onUploadHorizontalImages,
  onRemoveHorizontalImage,
  onOpenImagesPreview,
}: ProjectImagesTabsCPProps) {
  const [tab, setTab] = useState(0)

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
        {s.projectImagesSectionTitle}
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label={s.tabProjectCard} />
        <Tab label={s.tabVerticalImages} />
        <Tab label={s.tabHorizontalImages} />
      </Tabs>
      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && (
          <ProjectCardImageCP
            pendingFile={form.cardProjectFile}
            onPendingChange={(cardProjectFile) => onChange({ cardProjectFile })}
            uploadsBaseUrl={uploadsBaseUrl}
            existingFileName={existingCardProjectName}
            disabled={disabled}
            projectId={projectId}
            onUploadCard={onUploadCard}
            onRemoveCard={onRemoveCard}
            onOpenPreview={(item) => onOpenImagesPreview([item], 0)}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && (
          <ProjectImagePickerCP
            files={form.imageFiles}
            existingImages={existingVerticalImages}
            onFilesChange={(imageFiles) => onChange({ imageFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadImages={onUploadVerticalImages}
            onRemoveImage={onRemoveVerticalImage}
            onOpenImagesPreview={onOpenImagesPreview}
            sectionTitle={s.tabVerticalImages}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && (
          <ProjectImagePickerCP
            files={form.horizontalImageFiles}
            existingImages={existingHorizontalImages}
            onFilesChange={(horizontalImageFiles) => onChange({ horizontalImageFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadImages={onUploadHorizontalImages}
            onRemoveImage={onRemoveHorizontalImage}
            onOpenImagesPreview={onOpenImagesPreview}
            sectionTitle={s.tabHorizontalImages}
          />
        )}
      </Box>
    </Paper>
  )
}
