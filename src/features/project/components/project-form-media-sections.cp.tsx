import React, { useState } from "react"
import { Grid } from "@mui/material"
import ProjectImagesTabsCP from "./project-images-tabs.cp"
import ProjectVideosTabsCP from "./project-videos-tabs.cp"
import ProjectFileUploadFieldCP from "./project-file-upload-field.cp"
import ProjectMediaPreviewDialogCP from "./project-media-preview-dialog.cp"
import ProjectFormSectionCP from "./project-form-section.cp"
import { ExistingProjectImage } from "./project-image-picker.cp"
import { ExistingProjectVideo } from "./project-video-picker.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { ProjectFormSectionToggleProps } from "../types/project-form-section.types"
import { PROJECT_IMAGE_MAX_BYTES, PROJECT_VIDEO_MAX_BYTES } from "../utils/project-uploads.util"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import { formatSectionSummary } from "../utils/format-section-summary.util"

export type ProjectFormMediaSectionsCPProps = ProjectFormSectionToggleProps & {
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

type PreviewState = { items: ProjectPreviewItem[]; index: number } | null

export default function ProjectFormMediaSectionsCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingCardProjectName = null,
  existingVerticalImages,
  existingHorizontalImages,
  existingHorizontalVideos,
  existingReelVideos,
  disabled = false,
  projectId,
  onUploadCard,
  onRemoveCard,
  onUploadVerticalImages,
  onRemoveVerticalImage,
  onUploadHorizontalImages,
  onRemoveHorizontalImage,
  existingPlaneName = null,
  existingBrochureName = null,
  onUploadReelVideos,
  onRemoveReelVideo,
  onUploadHorizontalVideos,
  onRemoveHorizontalVideo,
  onUploadPlane,
  onRemovePlane,
  onUploadBrochure,
  onRemoveBrochure,
  isExpanded,
  onToggle
}: ProjectFormMediaSectionsCPProps) {
  const [preview, setPreview] = useState<PreviewState>(null)
  const openPreview = (items: ProjectPreviewItem[], index: number) => setPreview({ items, index })
  const imagesCount =
    (existingCardProjectName || form.cardProjectFile ? 1 : 0) +
    existingVerticalImages.length +
    existingHorizontalImages.length +
    form.imageFiles.length +
    form.horizontalImageFiles.length
  const videosCount =
    existingReelVideos.length +
    existingHorizontalVideos.length +
    form.reelVideoFiles.length +
    form.verticalVideoFiles.length
  const documentsCount =
    (existingPlaneName || form.planeFile ? 1 : 0) + (existingBrochureName || form.brochureFile ? 1 : 0)

  return (
    <>
      <ProjectFormSectionCP
        id="images"
        title={s.formSectionImages}
        summary={formatSectionSummary(s.formSummaryImages, imagesCount)}
        expanded={isExpanded("images")}
        onToggle={onToggle}
        useGrid={false}
      >
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
          onOpenImagesPreview={openPreview}
          maxImageBytes={PROJECT_IMAGE_MAX_BYTES}
        />
      </ProjectFormSectionCP>
      <ProjectFormSectionCP
        id="videos"
        title={s.formSectionVideos}
        summary={formatSectionSummary(s.formSummaryVideos, videosCount)}
        expanded={isExpanded("videos")}
        onToggle={onToggle}
        useGrid={false}
      >
        <ProjectVideosTabsCP
          form={form}
          onChange={onChange}
          uploadsBaseUrl={uploadsBaseUrl}
          existingReelVideos={existingReelVideos}
          existingHorizontalVideos={existingHorizontalVideos}
          disabled={disabled}
          projectId={projectId}
          onUploadReelVideos={onUploadReelVideos}
          onRemoveReelVideo={onRemoveReelVideo}
          onUploadHorizontalVideos={onUploadHorizontalVideos}
          onRemoveHorizontalVideo={onRemoveHorizontalVideo}
          onOpenPreview={openPreview}
          maxVideoBytes={PROJECT_VIDEO_MAX_BYTES}
        />
      </ProjectFormSectionCP>
      <ProjectFormSectionCP
        id="documents"
        title={s.formSectionDocuments}
        summary={formatSectionSummary(s.formSummaryFiles, documentsCount)}
        expanded={isExpanded("documents")}
        onToggle={onToggle}
      >
        <Grid item xs={12} md={6}>
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
            onOpenPreview={(item) => openPreview([item], 0)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
            onOpenPreview={(item) => openPreview([item], 0)}
          />
        </Grid>
      </ProjectFormSectionCP>
      <ProjectMediaPreviewDialogCP
        open={!!preview}
        items={preview?.items ?? []}
        initialIndex={preview?.index ?? 0}
        onClose={() => setPreview(null)}
      />
    </>
  )
}
