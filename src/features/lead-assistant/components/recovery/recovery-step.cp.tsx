import AddOutlined from "@mui/icons-material/AddOutlined"
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined"
import ScheduleSendOutlined from "@mui/icons-material/ScheduleSendOutlined"
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  fetchRecoveryThunk,
  openCreateStepAct,
  seedRecommendedStepsAct,
} from "../../slice/lead-assistant-recovery.slice"
import SectionEmptyStateCP from "../shared/section-empty-state.cp"
import SectionErrorStateCP from "../shared/section-error-state.cp"
import RecoveryAxisCP from "./recovery-axis.cp"
import RecoveryStepDrawerCP from "./recovery-step-drawer.cp"
import RecoveryStepListCP from "./recovery-step-list.cp"

/** Step 4: follow-up sequence for leads that stop answering. */
export default function RecoveryStepCP() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.leadAssistant.recovery.status)
  const error = useAppSelector((state) => state.leadAssistant.recovery.error)
  const count = useAppSelector((state) => state.leadAssistant.recovery.steps.length)
  const isFirstLoad = status === "idle" || status === "loading"
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={700}>
            {s.stepTitles.recovery}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
            {s.recoveryIntro}
          </Typography>
        </Box>
        {count > 0 ? (
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => dispatch(openCreateStepAct())}
            sx={{ flexShrink: 0 }}
          >
            {s.recoveryAddStep}
          </Button>
        ) : null}
      </Stack>
      {isFirstLoad ? (
        <Stack spacing={1.5} aria-busy="true" aria-label={s.loading}>
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={64} />
          <Skeleton variant="rounded" height={64} />
        </Stack>
      ) : status === "failed" ? (
        <SectionErrorStateCP
          message={error ?? s.recoveryLoadError}
          onRetry={() => void dispatch(fetchRecoveryThunk())}
        />
      ) : count === 0 ? (
        <Stack spacing={1}>
          <SectionEmptyStateCP
            icon={<ScheduleSendOutlined fontSize="large" />}
            title={s.recoveryEmptyTitle}
            body={s.recoveryEmptyBody}
            actionLabel={s.recoveryEmptyAction}
            actionIcon={<AutoAwesomeOutlined />}
            onAction={() => dispatch(seedRecommendedStepsAct())}
          />
          <Box>
            <Button size="small" onClick={() => dispatch(openCreateStepAct())}>
              {s.recoveryAddManual}
            </Button>
          </Box>
        </Stack>
      ) : (
        <>
          <RecoveryAxisCP />
          <RecoveryStepListCP />
        </>
      )}
      <RecoveryStepDrawerCP />
    </Stack>
  )
}
