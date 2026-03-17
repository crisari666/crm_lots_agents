import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"
import type { OnboardingLogUpdateType, OnboardingUserType } from "../types/onboarding-state.types"
import { dateUTCToFriendly } from "../../../utils/date.utils"

type UsersOnboardingStatusHistoryDialogCPProps = {
  open: boolean
  onClose: () => void
  user: OnboardingUserType
  logs: OnboardingLogUpdateType[]
}

export default function UsersOnboardingStatusHistoryDialogCP({
  open,
  onClose,
  user,
  logs
}: UsersOnboardingStatusHistoryDialogCPProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Onboarding history - {user.name} {user.lastName}
      </DialogTitle>
      <DialogContent dividers>
        {logs.length === 0 ? (
          <Typography variant="body2">No history available</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={`${log.date}-${log.status}-${index}`}>
                  <TableCell>{dateUTCToFriendly(log.date)}</TableCell>
                  <TableCell>{log.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

