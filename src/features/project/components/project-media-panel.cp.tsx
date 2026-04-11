import React, { useState } from "react"
import { Stack } from "@mui/material"
import ProjectImagesTabsCP from "./project-images-tabs.cp"
import ProjectVideosTabsCP from "./project-videos-tabs.cp"
import ProjectFileUploadFieldCP from "./project-file-upload-field.cp"
import ProjectMediaPreviewDialogCP from "./project-media-preview-dialog.cp"
import { ExistingProjectImage } from "./project-image-picker.cp"
import { ExistingProjectVideo } from "./project-video-picker.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { PROJECT_IMAGE_MAX_BYTES, PROJECT_VIDEO_MAX_BYTES } from "../utils/project-uploads.util"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectMediaPanelCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingCardProjectName?: string | null
  existingVerticalImages: ExistingProjectImage[]
  existingHorizontalImages: ExistingProjectImage[]
  existingHorizontalVideos: ExistingProjectVideo[]
  disabled?: boolean
  projectId?: string
  onUploadCard?: (file: File) => Promise<void>
  onRemoveCard?: () => Promise<void>
  onUploadVerticalImages?: (files: File[]) => Promise<void>
  onRemoveVerticalImage?: (imageName: string) => Promise<void>
  onUploadHorizontalImages?: (files: File[]) => Promise<void>
  onRemoveHorizontalImage?: (imageName: string) => Promise<void>
  existingReelVideoName?: string | null
  existingPlaneName?: string | null
  existingBrochureName?: string | null
  onUploadReelVideo?: (file: File) => Promise<void>
  onRemoveReelVideo?: () => Promise<void>
  onUploadHorizontalVideos?: (files: File[]) => Promise<void>
  onRemoveHorizontalVideo?: (videoName: string) => Promise<void>
  onUploadPlane?: (file: File) => Promise<void>
  onRemovePlane?: () => Promise<void>
  onUploadBrochure?: (file: File) => Promise<void>
  onRemoveBrochure?: () => Promise<void>
}

export default function ProjectMediaPanelCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingCardProjectName = null,
  existingVerticalImages,
  existingHorizontalImages,
  existingHorizontalVideos,
  disabled = false,
  projectId,
  onUploadCard,
  onRemoveCard,
  onUploadVerticalImages,
  onRemoveVerticalImage,
  onUploadHorizontalImages,
  onRemoveHorizontalImage,
  existingReelVideoName = null,
  existingPlaneName = null,
  existingBrochureName = null,
  onUploadReelVideo,
  onRemoveReelVideo,
  onUploadHorizontalVideos,
  onRemoveHorizontalVideo,
  onUploadPlane,
  onRemovePlane,
  onUploadBrochure,
  onRemoveBrochure,
}: ProjectMediaPanelCPProps) {
  const [preview, setPreview] = useState<{ items: ProjectPreviewItem[]; index: number } | null>(
    null
  )

  return (
    <Stack spacing={2}>
      <ProjectImagesTabsCP
        form={form}
        onChange={onChange}
        uploadsBaseUrl={uploadsBaseUrl}
        existingCardProjectName={existingCardProjectName}
        existingVerticalImages={existingVerticalImages}
        existingHorizontalImages={existingHorizontalImages}
        disabled={disabled}
        projectId={projectId}
        onUploadCard={onUploadCard}
        onRemoveCard={onRemoveCard}
        onUploadVerticalImages={onUploadVerticalImages}
        onRemoveVerticalImage={onRemoveVerticalImage}
        onUploadHorizontalImages={onUploadHorizontalImages}
        onRemoveHorizontalImage={onRemoveHorizontalImage}
        onOpenImagesPreview={(items, startIndex) => setPreview({ items, index: startIndex })}
        maxImageBytes={PROJECT_IMAGE_MAX_BYTES}
      />
      <ProjectVideosTabsCP
        form={form}
        onChange={onChange}
        uploadsBaseUrl={uploadsBaseUrl}
        existingReelVideoName={existingReelVideoName}
        existingHorizontalVideos={existingHorizontalVideos}
        disabled={disabled}
        projectId={projectId}
        onUploadReelVideo={onUploadReelVideo}
        onRemoveReelVideo={onRemoveReelVideo}
        onUploadHorizontalVideos={onUploadHorizontalVideos}
        onRemoveHorizontalVideo={onRemoveHorizontalVideo}
        onOpenPreview={(items, startIndex) => setPreview({ items, index: startIndex })}
        maxVideoBytes={PROJECT_VIDEO_MAX_BYTES}
      />
      <ProjectFileUploadFieldCP
        label={s.planeLabel}
        helperText={s.planeHelper}
        accept="application/pdf,image/jpeg,image/jpg,image/png"
        disabled={disabled}
        uploadsBaseUrl={uploadsBaseUrl}
        variant="plane"
        pendingFile={form.planeFile}
        onPendingChange={(planeFile) => onChange({ planeFile })}
        onUpload={onUploadPlane}
        onRemove={onRemovePlane}
        existingFileName={existingPlaneName}
        onOpenPreview={(item) => setPreview({ items: [item], index: 0 })}
      />
      <ProjectFileUploadFieldCP
        label={s.brochureLabel}
        helperText={s.brochureHelper}
        accept="application/pdf"
        disabled={disabled}
        uploadsBaseUrl={uploadsBaseUrl}
        variant="brochure"
        pendingFile={form.brochureFile}
        onPendingChange={(brochureFile) => onChange({ brochureFile })}
        onUpload={onUploadBrochure}
        onRemove={onRemoveBrochure}
        existingFileName={existingBrochureName}
        onOpenPreview={(item) => setPreview({ items: [item], index: 0 })}
      />
      <ProjectMediaPreviewDialogCP
        open={!!preview}
        items={preview?.items ?? []}
        initialIndex={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />
    </Stack>
  )
}
