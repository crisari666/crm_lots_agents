import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { OnboardingUserType } from "../types/onboarding-state.types"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import {
  clearHistoryFlowLogsAct,
  clearHistoryFlowsAct,
  fetchOnboardingFlowLogsThunk,
  fetchUserOnboardingFlowsThunk,
  selectHistoryFlowsState
} from "../slice/users-onboarding-status.slice"
import {
  onboardingFlowEventLabel,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingStatusFlowLogsDialogCP from "./users-onboarding-status-flow-logs-dialog.cp"

type UsersOnboardingStatusHistoryDialogCPProps = {
  open: boolean
  onClose: () => void
  user: OnboardingUserType
}

export default function UsersOnboardingStatusHistoryDialogCP({
  open,
  onClose,
  user
}: UsersOnboardingStatusHistoryDialogCPProps) {
  const dispatch = useAppDispatch()
  const { items, isLoading, error } = useAppSelector(selectHistoryFlowsState)
  const [logsOpen, setLogsOpen] = useState(false)

  useEffect(() => {
    if (!open || user._id == null || user._id === "") {
      return
    }
    dispatch(fetchUserOnboardingFlowsThunk(user._id))
  }, [open, user._id, dispatch])

  const handleClose = useCallback(() => {
    dispatch(clearHistoryFlowsAct())
    dispatch(clearHistoryFlowLogsAct())
    setLogsOpen(false)
    onClose()
  }, [dispatch, onClose])

  const handleCloseLogs = useCallback(() => {
    dispatch(clearHistoryFlowLogsAct())
    setLogsOpen(false)
  }, [dispatch])

  const handleRowClick = useCallback(
    (flowId: string) => {
      dispatch(fetchOnboardingFlowLogsThunk(flowId))
      setLogsOpen(true)
    },
    [dispatch]
  )

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack spacing={0.5}>
            <Typography component="span" variant="h6">
              {s.historyDialogTitle}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {user.name} {user.lastName}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
              <CircularProgress size={28} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {s.historyLoading}
              </Typography>
            </Box>
          ) : null}

          {!isLoading && error ? <Alert severity="error">{error}</Alert> : null}

          {!isLoading && !error && items.length === 0 ? (
            <Typography variant="body2">{s.historyNoFlows}</Typography>
          ) : null}

          {!isLoading && !error && items.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{s.historyColFlowStart}</TableCell>
                  <TableCell>{s.historyColCurrentStatus}</TableCell>
                  <TableCell>{s.historyColLastEvent}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((flow) => (
                  <TableRow
                    key={flow.flowId}
                    hover
                    onClick={() => handleRowClick(flow.flowId)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{dateUTCToFriendly(flow.date)}</TableCell>
                    <TableCell>{onboardingFlowEventLabel(flow.currentStatus)}</TableCell>
                    <TableCell>{dateUTCToFriendly(flow.lastEventAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}

          {!isLoading && !error && items.length > 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              {s.historyOpenLogs}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {s.close}
          </Button>
        </DialogActions>
      </Dialog>

      <UsersOnboardingStatusFlowLogsDialogCP open={logsOpen} onClose={handleCloseLogs} />
    </>
  )
}
