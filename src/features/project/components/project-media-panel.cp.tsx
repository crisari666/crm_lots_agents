import React, { useState } from "react"
import { Stack } from "@mui/material"
import ProjectImagePickerCP, { ExistingProjectImage } from "./project-image-picker.cp"
import ProjectFileUploadFieldCP from "./project-file-upload-field.cp"
import ProjectMediaPreviewDialogCP from "./project-media-preview-dialog.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectMediaPanelCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingImages: ExistingProjectImage[]
  disabled?: boolean
  projectId?: string
  onUploadImages?: (files: File[]) => Promise<void>
  onRemoveImage?: (imageName: string) => Promise<void>
  existingReelVideoName?: string | null
  existingPlaneName?: string | null
  existingBrochureName?: string | null
  onUploadReelVideo?: (file: File) => Promise<void>
  onUploadPlane?: (file: File) => Promise<void>
  onUploadBrochure?: (file: File) => Promise<void>
}

export default function ProjectMediaPanelCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingImages,
  disabled = false,
  projectId,
  onUploadImages,
  onRemoveImage,
  existingReelVideoName = null,
  existingPlaneName = null,
  existingBrochureName = null,
  onUploadReelVideo,
  onUploadPlane,
  onUploadBrochure,
}: ProjectMediaPanelCPProps) {
  const [preview, setPreview] = useState<{ items: ProjectPreviewItem[]; index: number } | null>(
    null
  )

  return (
    <Stack spacing={2}>
      <ProjectImagePickerCP
        files={form.imageFiles}
        existingImages={existingImages}
        onFilesChange={(imageFiles) => onChange({ imageFiles })}
        disabled={disabled}
        projectId={projectId}
        onUploadImages={onUploadImages}
        onRemoveImage={onRemoveImage}
        onOpenImagesPreview={(items, startIndex) => setPreview({ items, index: startIndex })}
      />
      <ProjectFileUploadFieldCP
        label={s.reelVideoLabel}
        helperText={s.reelVideoHelper}
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
        disabled={disabled}
        uploadsBaseUrl={uploadsBaseUrl}
        variant="reel"
        pendingFile={form.reelVideoFile}
        onPendingChange={(reelVideoFile) => onChange({ reelVideoFile })}
        onUpload={onUploadReelVideo}
        existingFileName={existingReelVideoName}
        onOpenPreview={(item) => setPreview({ items: [item], index: 0 })}
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
