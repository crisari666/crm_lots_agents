import { Alert, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import {
  selectUsersOnboardingStatusFilteredItems,
  selectUsersOnboardingStatusState
} from "../slice/users-onboarding-status.slice"
import type { OnboardingStateType } from "../types/onboarding-state.types"

export default function UsersOnboardingStatusListCP() {
  const { isLoading, error } = useAppSelector(selectUsersOnboardingStatusState)
  const items: OnboardingStateType[] = useAppSelector(selectUsersOnboardingStatusFilteredItems)

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
            <TableCell>Status</TableCell>
            <TableCell>Last update</TableCell>
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
              <TableCell>{x.status}</TableCell>
              <TableCell>{x.lastUpdate}</TableCell>
            </TableRow>
          ))}

          {items.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2">No users found</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

