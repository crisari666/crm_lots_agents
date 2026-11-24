import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined"
import CloseOutlined from "@mui/icons-material/CloseOutlined"
import {
  Box,
  Button,
  Drawer,
  Fade,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useBlocker } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { useFadeDuration } from "../../hooks/use-prefers-reduced-motion"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { useHasUnsavedChanges } from "../../hooks/use-step-dirty"
import { fetchSettingsThunk } from "../../slice/lead-assistant-settings.slice"
import type { LeadAssistantStepKey } from "../../types/lead-assistant.types"
import ActivationStepCP from "../activation/activation-step.cp"
import ConnectionStepCP from "../connection/connection-step.cp"
import IdentityStepCP from "../identity/identity-step.cp"
import KnowledgeStepCP from "../knowledge/knowledge-step.cp"
import RecoveryStepCP from "../recovery/recovery-step.cp"
import ConfirmDialogCP from "./confirm-dialog.cp"
import SaveBarCP from "./save-bar.cp"
import SectionErrorStateCP from "./section-error-state.cp"
import SetupProgressHeaderCP from "./setup-progress-header.cp"
import SetupRailCP from "./setup-rail.cp"
import WhatsAppPreviewCP from "./whatsapp-preview.cp"

const RAIL_WIDTH = 220
const PREVIEW_WIDTH = 340

function renderStep(step: LeadAssistantStepKey) {
  switch (step) {
    case "connection":
      return <ConnectionStepCP />
    case "identity":
      return <IdentityStepCP />
    case "knowledge":
      return <KnowledgeStepCP />
    case "recovery":
      return <RecoveryStepCP />
    case "activation":
      return <ActivationStepCP />
  }
}

function LayoutSkeleton() {
  return (
    <Box
      aria-busy="true"
      aria-label={s.loading}
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: `minmax(0, 1fr) ${PREVIEW_WIDTH}px`,
          lg: `${RAIL_WIDTH}px minmax(0, 1fr) ${PREVIEW_WIDTH}px`,
        },
      }}
    >
      <Stack spacing={1} sx={{ display: { xs: "none", lg: "flex" } }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} variant="rounded" height={56} />
        ))}
      </Stack>
      <Stack spacing={2}>
        <Skeleton variant="text" width="40%" height={36} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={140} />
      </Stack>
      <Skeleton variant="rounded" height={320} sx={{ display: { xs: "none", md: "block" } }} />
    </Box>
  )
}

function PreviewDrawerButton() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
      <Button variant="outlined" startIcon={<VisibilityOutlined />} onClick={() => setIsOpen(true)}>
        {s.previewButton}
      </Button>
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{ sx: { maxHeight: "80vh", borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
      >
        <Box sx={{ p: 2 }} role="dialog" aria-label={s.previewTitle}>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton aria-label={s.close} onClick={() => setIsOpen(false)} size="small">
              <CloseOutlined />
            </IconButton>
          </Stack>
          <WhatsAppPreviewCP />
        </Box>
      </Drawer>
    </Box>
  )
}

function useLeaveGuard() {
  const hasUnsaved = useHasUnsavedChanges()
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsaved && currentLocation.pathname !== nextLocation.pathname,
  )
  useEffect(() => {
    if (!hasUnsaved) {
      return undefined
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsaved])
  return blocker
}

/** Three-column setup layout: rail | editor | sticky preview, collapsing by breakpoint. */
export default function LeadAssistantLayoutCP() {
  const dispatch = useAppDispatch()
  const { step } = useLeadAssistantStep()
  const status = useAppSelector((state) => state.leadAssistant.settings.status)
  const error = useAppSelector((state) => state.leadAssistant.settings.error)
  const fadeDuration = useFadeDuration()
  const blocker = useLeaveGuard()
  const isLoading = status === "idle" || status === "loading"
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1280 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {s.pageTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 640 }}>
          {s.pageSubtitle}
        </Typography>
      </Box>
      <SetupProgressHeaderCP />
      {status === "failed" ? (
        <SectionErrorStateCP
          message={error ?? s.settingsLoadError}
          onRetry={() => void dispatch(fetchSettingsThunk())}
        />
      ) : isLoading ? (
        <LayoutSkeleton />
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            alignItems: "start",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: `minmax(0, 1fr) ${PREVIEW_WIDTH}px`,
              lg: `${RAIL_WIDTH}px minmax(0, 1fr) ${PREVIEW_WIDTH}px`,
            },
          }}
        >
          <Box sx={{ display: { xs: "none", lg: "block" }, position: "sticky", top: 16 }}>
            <SetupRailCP />
          </Box>
          <Box component="main" aria-label={s.stepTitles[step]} sx={{ minWidth: 0 }}>
            <PreviewDrawerButton />
            <Fade in key={step} timeout={fadeDuration}>
              <Box>{renderStep(step)}</Box>
            </Fade>
            <SaveBarCP />
          </Box>
          <Box
            component="aside"
            sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 16 }}
          >
            <WhatsAppPreviewCP />
          </Box>
        </Box>
      )}
      <ConfirmDialogCP
        open={blocker.state === "blocked"}
        title={s.leaveTitle}
        body={s.leaveBody}
        confirmLabel={s.leaveConfirm}
        cancelLabel={s.leaveStay}
        isDestructive
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </Box>
  )
}
