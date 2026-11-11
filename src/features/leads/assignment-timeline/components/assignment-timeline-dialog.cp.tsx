import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadsStrings as s } from "../../../../i18n/locales/leads.strings"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import {
  closeAssignmentTimelineAct,
  fetchAssignmentTimelineThunk,
} from "../slice/assignment-timeline.slice"
import AssignmentTimelineBoardCP from "./assignment-timeline-board.cp"
import AssignmentTimelineToolbarCP from "./assignment-timeline-toolbar.cp"

/**
 * Almost full-width dialog hosting the ventor × time assignment timeline.
 * Chip click opens the shared customer detail dialog via customerV2 slice.
 */
export default function AssignmentTimelineDialogCP() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((state) => state.assignmentTimeline.open)
  const error = useAppSelector((state) => state.assignmentTimeline.error)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)

  useEffect(() => {
    if (!open) {
      return
    }
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
    void dispatch(fetchAssignmentTimelineThunk())
  }, [open, dispatch, gotUsers])

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeAssignmentTimelineAct())}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "min(96vw, 1400px)",
          maxWidth: "96vw",
          height: "80vh",
          m: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="span">
            {s.timelineTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {s.timelineSubtitle}
          </Typography>
        </Box>
        <IconButton
          aria-label={s.timelineClose}
          onClick={() => dispatch(closeAssignmentTimelineAct())}
          sx={{ cursor: "pointer" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
        <AssignmentTimelineToolbarCP />
        {error ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        ) : null}
        <AssignmentTimelineBoardCP />
      </DialogContent>
    </Dialog>
  )
}
