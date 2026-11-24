import { Alert, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { clearNoticeAct } from "../../slice/lead-assistant-setup.slice"

const NOTICE_DURATION_MS = 4000

/** Snackbar for transient success/error messages of the whole setup. */
export default function LeadAssistantNoticeCP() {
  const dispatch = useAppDispatch()
  const notice = useAppSelector((state) => state.leadAssistant.setup.notice)
  return (
    <Snackbar
      open={notice != null}
      autoHideDuration={NOTICE_DURATION_MS}
      onClose={(_, reason) => {
        if (reason !== "clickaway") {
          dispatch(clearNoticeAct())
        }
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={notice?.severity ?? "info"}
        variant="filled"
        onClose={() => dispatch(clearNoticeAct())}
      >
        {notice?.message ?? ""}
      </Alert>
    </Snackbar>
  )
}
