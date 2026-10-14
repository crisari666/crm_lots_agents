import React from "react"
import { Alert, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearLeadConversationNoticeAct } from "../slice/lead-conversations.slice"

const NOTICE_DURATION_MS = 5000

/** Success feedback after restart / delete. */
export default function LeadConversationNoticeCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const notice = useAppSelector((state) => state.leadConversations.actionNotice)
  const close = () => dispatch(clearLeadConversationNoticeAct())
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
