import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  MobileStepper,
  Button,
  useTheme,
} from "@mui/material"
import Close from "@mui/icons-material/Close"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import { ProjectPreviewItem } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectMediaPreviewDialogCPProps = {
  open: boolean
  items: ProjectPreviewItem[]
  initialIndex?: number
  onClose: () => void
}

export default function ProjectMediaPreviewDialogCP({
  open,
  items,
  initialIndex = 0,
  onClose,
}: ProjectMediaPreviewDialogCPProps) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(initialIndex)

  useEffect(() => {
    if (open) setActiveStep(Math.min(initialIndex, Math.max(0, items.length - 1)))
  }, [open, initialIndex, items.length])

  const maxSteps = items.length
  const current = items[activeStep]
  const hasMany = maxSteps > 1

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1))
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pr: 1,
        }}
      >
        <Typography component="span" variant="h6" noWrap sx={{ flex: 1 }}>
          {current?.title ?? s.mediaPreviewTitle}
        </Typography>
        {hasMany && (
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            {activeStep + 1} / {maxSteps}
          </Typography>
        )}
        <IconButton aria-label={s.mediaPreviewClose} onClick={onClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: { xs: 280, sm: 360 },
          bgcolor: "action.hover",
          p: 2,
        }}
      >
        {current && current.kind === "image" && (
          <Box
            component="img"
            src={current.src}
            alt=""
            sx={{
              maxWidth: "100%",
              maxHeight: { xs: "50vh", sm: "65vh" },
              objectFit: "contain",
              borderRadius: 1,
              boxShadow: 2,
            }}
          />
        )}
        {current && current.kind === "video" && (
          <Box
            key={current.src}
            component="video"
            src={current.src}
            controls
            playsInline
            sx={{
              width: "100%",
              maxHeight: { xs: "50vh", sm: "65vh" },
              borderRadius: 1,
              bgcolor: "common.black",
            }}
          />
        )}
        {current && current.kind === "pdf" && (
          <Box
            key={current.src}
            component="iframe"
            src={current.src}
            title={current.title ?? "pdf"}
            sx={{
              width: "100%",
              height: { xs: "50vh", sm: "65vh" },
              border: 0,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          />
        )}
        {!current && (
          <Typography color="text.secondary">{s.mediaPreviewTitle}</Typography>
        )}
      </DialogContent>
      {hasMany && (
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ flexGrow: 1, px: 2, pb: 2, bgcolor: "background.paper" }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              {s.mediaPreviewNext}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              {s.mediaPreviewBack}
            </Button>
          }
        />
      )}
    </Dialog>
  )
}
