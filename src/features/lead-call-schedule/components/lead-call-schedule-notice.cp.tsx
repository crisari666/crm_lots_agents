import React from "react"
import { Alert, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearLeadCallNoticeAct } from "../slice/lead-call-schedule.slice"

const NOTICE_DURATION_MS = 5000

export default function LeadCallScheduleNoticeCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const notice = useAppSelector((state) => state.leadCallSchedule.actionNotice)
  const close = () => dispatch(clearLeadCallNoticeAct())
  return (
    <Snackbar
      open={notice !== null}
      autoHideDuration={NOTICE_DURATION_MS}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled" onClose={close} sx={{ width: "100%" }}>
        {notice}
      </Alert>
    </Snackbar>
  )
}
