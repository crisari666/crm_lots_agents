import { Alert, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearNoticeAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadFormsNoticeCP() {
  const dispatch = useAppDispatch()
  const notice = useAppSelector((state) => state.metaLeadForms.notice)
  const error = useAppSelector((state) => state.metaLeadForms.error)
  const open = notice != null || error != null
  const severity = error != null ? "error" : "success"
  const message = error ?? notice ?? ""

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(clearNoticeAct())}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={() => dispatch(clearNoticeAct())} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}
