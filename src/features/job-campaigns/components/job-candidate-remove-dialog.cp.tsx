import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import {
  removeJobCampaignCandidateThunk,
  selectJobCampaignState,
} from "../slice/job-campaign.slice"
import type { JobCampaignCandidateItem } from "../types/job-campaign.types"

type Props = {
  readonly candidate: JobCampaignCandidateItem | null
  readonly onClose: () => void
}

/** Confirms the permanent removal of a candidate and everything linked to them. */
export function JobCandidateRemoveDialogCp(props: Props) {
  const dispatch = useAppDispatch()
  const { removeCandidateStatus } = useAppSelector(selectJobCampaignState)
  const [hasError, setHasError] = useState<boolean>(false)
  const { candidate, onClose } = props
  const isRemoving = removeCandidateStatus === "loading"
  useEffect(() => {
    setHasError(false)
  }, [candidate?.id])
  const handleClose = (): void => {
    if (!isRemoving) onClose()
  }
  const handleConfirm = async (): Promise<void> => {
    if (candidate == null) return
    setHasError(false)
    const result = await dispatch(
      removeJobCampaignCandidateThunk({
        campaignId: candidate.campaignId,
        candidateId: candidate.id,
      }),
    )
    if (removeJobCampaignCandidateThunk.fulfilled.match(result)) {
      onClose()
      return
    }
    setHasError(true)
  }
  const fullName = candidate != null ? `${candidate.name} ${candidate.lastName}`.trim() : ""
  return (
    <Dialog
      open={candidate != null}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="remove-candidate-title"
    >
      <DialogTitle id="remove-candidate-title">{s.removeCandidateTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {s.removeCandidateBody}{" "}
          <Typography component="span" variant="body2" fontWeight={700}>
            {fullName}
          </Typography>
          :
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 2, pl: 2.5 }}>
          {s.removeCandidateItems.map((item) => (
            <Typography component="li" variant="body2" key={item}>
              {item}
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {s.removeCandidateKeepsLead}
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ mt: 1.5 }}>
          {s.removeCandidateIrreversible}
        </Typography>
        {hasError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {s.removeCandidateError}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isRemoving}>
          {s.removeCandidateCancel}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => void handleConfirm()}
          disabled={isRemoving}
          startIcon={isRemoving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {s.removeCandidateConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
