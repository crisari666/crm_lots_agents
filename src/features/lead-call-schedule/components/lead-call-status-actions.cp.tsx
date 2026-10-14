import React, { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material"
import { CheckCircleOutline, EventBusy } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { updateLeadCallStatusThunk } from "../slice/lead-call-schedule.slice"
import type { LeadCallItem } from "../types/lead-call-schedule.types"

type Props = {
  item: LeadCallItem
}

export default function LeadCallStatusActionsCP({ item }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const isActionRunning = useAppSelector((state) => state.leadCallSchedule.isActionRunning)
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false)
  const markDone = () => void dispatch(updateLeadCallStatusThunk({ eventId: item.eventId, status: "done" }))
  const confirmCancel = () =>
    void dispatch(updateLeadCallStatusThunk({ eventId: item.eventId, status: "cancelled" })).then(() =>
      setIsCancelOpen(false)
    )
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleOutline />}
          onClick={markDone}
          disabled={isActionRunning}
          sx={{ flex: 1 }}
        >
          {s.markDone}
        </Button>
        <Button
          variant="text"
          color="error"
          startIcon={<EventBusy />}
          onClick={() => setIsCancelOpen(true)}
          disabled={isActionRunning}
        >
          {s.cancelCall}
        </Button>
      </Stack>
      <Dialog open={isCancelOpen} onClose={isActionRunning ? undefined : () => setIsCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{s.cancelConfirmTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {s.cancelConfirmBody}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCancelOpen(false)} disabled={isActionRunning}>
            {s.back}
          </Button>
          <Button color="error" variant="contained" onClick={confirmCancel} disabled={isActionRunning}>
            {s.confirmCancel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
