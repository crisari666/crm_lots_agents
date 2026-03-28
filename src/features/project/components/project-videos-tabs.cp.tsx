import React, { useState } from "react"
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import ProjectFileUploadFieldCP from "./project-file-upload-field.cp"
import ProjectVideoPickerCP, { ExistingProjectVideo } from "./project-video-picker.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectVideosTabsCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingReelVideoName?: string | null
  existingHorizontalVideos: ExistingProjectVideo[]
  disabled?: boolean
  projectId?: string
  onUploadReelVideo?: (file: File) => Promise<void>
  onRemoveReelVideo?: () => Promise<void>
  onUploadHorizontalVideos?: (files: File[]) => Promise<void>
  onRemoveHorizontalVideo?: (videoName: string) => Promise<void>
  onOpenPreview: (items: ProjectPreviewItem[], startIndex: number) => void
}

export default function ProjectVideosTabsCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingReelVideoName = null,
  existingHorizontalVideos,
  disabled = false,
  projectId,
  onUploadReelVideo,
  onRemoveReelVideo,
  onUploadHorizontalVideos,
  onRemoveHorizontalVideo,
  onOpenPreview,
}: ProjectVideosTabsCPProps) {
  const [tab, setTab] = useState(0)

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
        {s.projectVideosSectionTitle}
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label={s.reelVideosTab} />
        <Tab label={s.horizontalVideosTab} />
      </Tabs>
      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && (
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
            onRemove={onRemoveReelVideo}
            existingFileName={existingReelVideoName}
            onOpenPreview={(item) => onOpenPreview([item], 0)}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && (
          <ProjectVideoPickerCP
            files={form.verticalVideoFiles}
            existingVideos={existingHorizontalVideos}
            onFilesChange={(verticalVideoFiles) => onChange({ verticalVideoFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadVideos={onUploadHorizontalVideos}
            onRemoveVideo={onRemoveHorizontalVideo}
            onOpenPreview={onOpenPreview}
            sectionTitle={s.horizontalVideosTab}
          />
        )}
      </Box>
    </Paper>
  )
}
