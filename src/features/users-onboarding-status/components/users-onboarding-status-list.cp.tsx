import { Alert, Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import HistoryIcon from "@mui/icons-material/History"
import { useState } from "react"
import { useAppSelector } from "../../../app/hooks"
import {
  selectUsersOnboardingStatusFilteredItems,
  selectUsersOnboardingStatusState
} from "../slice/users-onboarding-status.slice"
import type { OnboardingStateType } from "../types/onboarding-state.types"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import UsersOnboardingStatusHistoryDialogCP from "./users-onboarding-status-history-dialog.cp"

export default function UsersOnboardingStatusListCP() {
  const [selectedItem, setSelectedItem] = useState<OnboardingStateType | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { isLoading, error } = useAppSelector(selectUsersOnboardingStatusState)
  const items: OnboardingStateType[] = useAppSelector(selectUsersOnboardingStatusFilteredItems)

  const handleOpenHistory = (item: OnboardingStateType) => {
    setSelectedItem(item)
    setIsHistoryOpen(true)
  }

  const handleCloseHistory = () => {
    setIsHistoryOpen(false)
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <TableContainer component={Paper} sx={{ position: "relative" }}>
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.6)",
            zIndex: 1
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Whatsapp</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last update</TableCell>
            <TableCell align="center">History</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((x) => (
            <TableRow key={x.userId?._id ?? `${x.createdAt}-${x.lastUpdate}`}>
              <TableCell>
                <Typography variant="body2">
                  {x.userId?.name} {x.userId?.lastName}
                </Typography>
              </TableCell>
              <TableCell>{x.userId?.email}</TableCell>
              <TableCell>{x.userId?.phone}</TableCell>
              <TableCell>{x.status}</TableCell>
              <TableCell>{dateUTCToFriendly(x.lastUpdate)}</TableCell>
              <TableCell align="center">
                <Tooltip title="View history">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenHistory(x)}
                  >
                    <HistoryIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}

          {items.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2">No users found</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {selectedItem ? (
        <UsersOnboardingStatusHistoryDialogCP
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          user={selectedItem.userId}
          logs={selectedItem.logsUpdate}
        />
      ) : null}
    </TableContainer>
  )
}

