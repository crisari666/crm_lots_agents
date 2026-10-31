import React, { useEffect } from "react"
import { Snackbar, Alert } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearLeadsNoticeAct } from "../slice/leads.slice"

export default function LeadsNoticeCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const notice = useAppSelector((state) => state.leads.actionNotice)
  const error = useAppSelector((state) => state.leads.actionError)
  const open = Boolean(notice || error)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => dispatch(clearLeadsNoticeAct()), 4000)
    return () => window.clearTimeout(timer)
  }, [dispatch, open, notice, error])

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert
        severity={error ? "error" : "success"}
        onClose={() => dispatch(clearLeadsNoticeAct())}
        variant="filled"
      >
        {error ?? notice}
      </Alert>
    </Snackbar>
  )
}
