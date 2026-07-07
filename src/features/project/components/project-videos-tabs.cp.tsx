import React, { useState } from "react"
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material"
import ProjectVideoPickerCP, { ExistingProjectVideo } from "./project-video-picker.cp"
import { ProjectFormState, ProjectPreviewItem } from "../types/project.types"
import { PROJECT_VIDEO_MAX_BYTES } from "../utils/project-uploads.util"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectVideosTabsCPProps = {
  form: ProjectFormState
  onChange: (updates: Partial<ProjectFormState>) => void
  uploadsBaseUrl: string
  existingReelVideos: ExistingProjectVideo[]
  existingHorizontalVideos: ExistingProjectVideo[]
  disabled?: boolean
  projectId?: string
  onUploadReelVideos?: (files: File[]) => Promise<void>
  onRemoveReelVideo?: (videoName: string) => Promise<void>
  onUploadHorizontalVideos?: (files: File[]) => Promise<void>
  onRemoveHorizontalVideo?: (videoName: string) => Promise<void>
  onOpenPreview: (items: ProjectPreviewItem[], startIndex: number) => void
  maxVideoBytes?: number
}

export default function ProjectVideosTabsCP({
  form,
  onChange,
  uploadsBaseUrl,
  existingReelVideos,
  existingHorizontalVideos,
  disabled = false,
  projectId,
  onUploadReelVideos,
  onRemoveReelVideo,
  onUploadHorizontalVideos,
  onRemoveHorizontalVideo,
  onOpenPreview,
  maxVideoBytes = PROJECT_VIDEO_MAX_BYTES,
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
          <ProjectVideoPickerCP
            files={form.reelVideoFiles}
            existingVideos={existingReelVideos}
            onFilesChange={(reelVideoFiles) => onChange({ reelVideoFiles })}
            disabled={disabled}
            projectId={projectId}
            onUploadVideos={onUploadReelVideos}
            onRemoveVideo={onRemoveReelVideo}
            onOpenPreview={onOpenPreview}
            sectionTitle={s.reelVideosTab}
            maxFileBytes={maxVideoBytes}
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
            maxFileBytes={maxVideoBytes}
          />
        )}
      </Box>
    </Paper>
  )
}
