import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import { useMeetDispatchPolling } from "../hooks/use-meet-dispatch-polling"
import {
  refreshJobCampaignCandidatesThunk,
  selectJobCampaignState,
  sendCampaignMeetBatchThunk,
} from "../slice/job-campaign.slice"
import type { JobCampaignAdminItem, JobCampaignMeetBatchResult } from "../types/job-campaign.types"
import { hasCampaignGroupMeet } from "../utils/campaign-group-meet.util"

const MEET_BATCH_SIZE = 5
const MEET_BATCH_INTERVAL_SECONDS = 30
const SECONDS_PER_MINUTE = 60

type Props = {
  readonly campaign: JobCampaignAdminItem
  readonly candidateIds: readonly string[]
  readonly selectedIds: ReadonlySet<string>
  readonly onToggleAll: (isChecked: boolean) => void
  readonly onSent: () => void
}

const formatEstimate = (count: number): string => {
  const seconds = Math.ceil(count / MEET_BATCH_SIZE) * MEET_BATCH_INTERVAL_SECONDS
  if (seconds < SECONDS_PER_MINUTE) return `~${seconds} s`
  return `~${Math.ceil(seconds / SECONDS_PER_MINUTE)} min`
}

/** Select-all + "send Meet over WhatsApp" toolbar for the candidates list. */
export function JobCandidateMeetBatchBarCp(props: Props) {
  const dispatch = useAppDispatch()
  const { meetBatchStatus } = useAppSelector(selectJobCampaignState)
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [lastResult, setLastResult] = useState<JobCampaignMeetBatchResult | null>(null)
  useMeetDispatchPolling(props.campaign.id)
  const selectedCount = props.selectedIds.size
  const totalCount = props.candidateIds.length
  const isAllSelected = totalCount > 0 && selectedCount === totalCount
  const canSendMeet = hasCampaignGroupMeet(props.campaign)
  const isSending = meetBatchStatus === "loading"
  const handleConfirm = async (): Promise<void> => {
    const result = await dispatch(
      sendCampaignMeetBatchThunk({
        campaignId: props.campaign.id,
        candidateIds: [...props.selectedIds],
      }),
    )
    if (!sendCampaignMeetBatchThunk.fulfilled.match(result)) return
    void dispatch(refreshJobCampaignCandidatesThunk({ campaignId: props.campaign.id }))
    setLastResult(result.payload)
    setIsConfirmOpen(false)
    props.onSent()
  }
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        <Checkbox
          size="small"
          checked={isAllSelected}
          indeterminate={selectedCount > 0 && !isAllSelected}
          disabled={totalCount === 0}
          onChange={(event) => props.onToggleAll(event.target.checked)}
          inputProps={{ "aria-label": s.meetBatchSelectAll }}
          sx={{ ml: -1 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }}>
          {selectedCount > 0 ? `${selectedCount} ${s.meetBatchSelected}` : s.meetBatchSelectAll}
        </Typography>
        <Tooltip title={canSendMeet ? "" : s.meetBatchDisabledHint}>
          <Box component="span">
            <Button
              size="small"
              variant="contained"
              startIcon={<SendIcon fontSize="small" />}
              disabled={!canSendMeet || selectedCount === 0}
              onClick={() => setIsConfirmOpen(true)}
            >
              {s.meetBatchSend}
            </Button>
          </Box>
        </Tooltip>
      </Stack>
      {lastResult != null ? (
        <Typography variant="caption" color="success.main" aria-live="polite">
          {lastResult.queued} {s.meetBatchQueued}
          {lastResult.skipped > 0 ? ` · ${lastResult.skipped} ${s.meetBatchSkipped}` : ""}
        </Typography>
      ) : null}
      <Dialog
        open={isConfirmOpen}
        onClose={() => (isSending ? undefined : setIsConfirmOpen(false))}
        maxWidth="xs"
        fullWidth
        aria-labelledby="meet-batch-confirm-title"
      >
        <DialogTitle id="meet-batch-confirm-title">{s.meetBatchConfirmTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {s.meetBatchConfirmBody}{" "}
            <strong>
              {selectedCount} {s.meetBatchConfirmCandidates}
            </strong>
            .
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {s.meetBatchConfirmPacing} <strong>{formatEstimate(selectedCount)}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {s.meetBatchConfirmSkipNote}
          </Typography>
          {meetBatchStatus === "failed" ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {s.meetBatchError}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsConfirmOpen(false)} disabled={isSending}>
            {s.meetBatchCancel}
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleConfirm()}
            disabled={isSending}
            startIcon={isSending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {s.meetBatchConfirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
