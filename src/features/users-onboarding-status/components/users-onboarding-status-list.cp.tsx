import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import HistoryIcon from "@mui/icons-material/History"
import TouchAppIcon from "@mui/icons-material/TouchApp"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectSelectedOrphanOnboardingRowIds,
  selectSelectedRescheduleUserIds,
  selectUsersOnboardingStatusFilteredItems,
  selectUsersOnboardingStatusState,
  toggleOrphanOnboardingRowSelectedAct,
  toggleRescheduleUserSelectedAct,
  toggleSelectAllVisibleOrphanOnboardingRowsAct,
  toggleSelectAllVisibleRescheduleUsersAct
} from "../slice/users-onboarding-status.slice"
import type { OnboardingStateType, OnboardingUserType } from "../types/onboarding-state.types"
import { isOrphanOnboardingListRow } from "../types/onboarding-state.types"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import UsersOnboardingStatusHistoryDialogCP from "./users-onboarding-status-history-dialog.cp"
import UsersOnboardingStatusActionsDialogCP from "./users-onboarding-status-actions-dialog.cp"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type UsersOnboardingStatusListCPProps = {
  onOpenWhatsappChat: (user: OnboardingUserType) => void
}

export default function UsersOnboardingStatusListCP({ onOpenWhatsappChat }: UsersOnboardingStatusListCPProps) {
  const dispatch = useAppDispatch()
  const [selectedItem, setSelectedItem] = useState<OnboardingStateType | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [actionsItem, setActionsItem] = useState<OnboardingStateType | null>(null)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const { isLoading, error } = useAppSelector(selectUsersOnboardingStatusState)
  const items: OnboardingStateType[] = useAppSelector(selectUsersOnboardingStatusFilteredItems)
  const selectedOrphanIds = useAppSelector(selectSelectedOrphanOnboardingRowIds)
  const selectedRescheduleUserIds = useAppSelector(selectSelectedRescheduleUserIds)

  const visibleOrphanIds = items
    .filter(isOrphanOnboardingListRow)
    .map((x) => x._id as string)
  const allOrphansSelected =
    visibleOrphanIds.length > 0 && visibleOrphanIds.every((id) => selectedOrphanIds.includes(id))
  const someOrphansSelected = visibleOrphanIds.some((id) => selectedOrphanIds.includes(id))

  const visibleRescheduleUserIds = Array.from(
    new Set(
      items
        .map((x) => x.userId?._id)
        .filter((id): id is string => Boolean(id))
    )
  )
  const allRescheduleSelected =
    visibleRescheduleUserIds.length > 0 &&
    visibleRescheduleUserIds.every((id) => selectedRescheduleUserIds.includes(id))
  const someRescheduleSelected = visibleRescheduleUserIds.some((id) =>
    selectedRescheduleUserIds.includes(id)
  )

  const handleOpenHistory = (item: OnboardingStateType) => {
    setSelectedItem(item)
    setIsHistoryOpen(true)
  }

  const handleCloseHistory = () => {
    setIsHistoryOpen(false)
  }

  const handleOpenActions = (item: OnboardingStateType) => {
    setActionsItem(item)
    setIsActionsOpen(true)
  }

  const handleCloseActions = () => {
    setIsActionsOpen(false)
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
            <TableCell padding="checkbox">
              {visibleOrphanIds.length > 0 ? (
                <Tooltip title={s.selectOrphanRows}>
                  <Checkbox
                    size="small"
                    indeterminate={someOrphansSelected && !allOrphansSelected}
                    checked={allOrphansSelected}
                    onChange={() =>
                      dispatch(toggleSelectAllVisibleOrphanOnboardingRowsAct(visibleOrphanIds))
                    }
                    inputProps={{ "aria-label": s.selectOrphanRows }}
                  />
                </Tooltip>
              ) : null}
            </TableCell>
            <TableCell padding="checkbox">
              {visibleRescheduleUserIds.length > 0 ? (
                <Tooltip title={s.selectUsersForReschedule}>
                  <Checkbox
                    size="small"
                    indeterminate={someRescheduleSelected && !allRescheduleSelected}
                    checked={allRescheduleSelected}
                    onChange={() =>
                      dispatch(
                        toggleSelectAllVisibleRescheduleUsersAct(visibleRescheduleUserIds)
                      )
                    }
                    inputProps={{ "aria-label": s.selectUsersForReschedule }}
                  />
                </Tooltip>
              ) : null}
            </TableCell>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Whatsapp</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last update</TableCell>
            <TableCell align="center">{s.actionsOpen}</TableCell>
            <TableCell align="center">History</TableCell>
            <TableCell align="center">{s.whatsappChatOpen}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((x) => {
            const rowId = x._id ?? `${x.createdAt}-${x.lastUpdate}`
            const orphan = isOrphanOnboardingListRow(x)
            const stateId = x._id
            const userMongoId = x.userId?._id
            return (
              <TableRow key={rowId}>
                <TableCell padding="checkbox">
                  {orphan && stateId ? (
                    <Checkbox
                      size="small"
                      checked={selectedOrphanIds.includes(stateId)}
                      onChange={() => dispatch(toggleOrphanOnboardingRowSelectedAct(stateId))}
                    />
                  ) : null}
                </TableCell>
                <TableCell padding="checkbox">
                  {userMongoId ? (
                    <Checkbox
                      size="small"
                      checked={selectedRescheduleUserIds.includes(userMongoId)}
                      onChange={() =>
                        dispatch(toggleRescheduleUserSelectedAct(userMongoId))
                      }
                    />
                  ) : null}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {x.userId ? `${x.userId.name} ${x.userId.lastName}`.trim() : "—"}
                  </Typography>
                </TableCell>
                <TableCell>{x.userId?.email ?? "—"}</TableCell>
                <TableCell>{x.userId?.phone ?? "—"}</TableCell>
                <TableCell>{x.status}</TableCell>
                <TableCell>{dateUTCToFriendly(x.lastUpdate)}</TableCell>
                <TableCell align="center">
                  <Tooltip title={s.actionsOpen}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId}
                        onClick={() => handleOpenActions(x)}
                      >
                        <TouchAppIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={s.viewHistory}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId}
                        onClick={() => handleOpenHistory(x)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={s.whatsappChatOpen}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId || !(x.userId.phone ?? "").trim()}
                        onClick={() => x.userId != null && onOpenWhatsappChat(x.userId)}
                      >
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}

          {items.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={10}>
                <Typography variant="body2">No users found</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {selectedItem?.userId ? (
        <UsersOnboardingStatusHistoryDialogCP
          open={isHistoryOpen}
          onClose={handleCloseHistory}
          user={selectedItem.userId}
        />
      ) : null}

      <UsersOnboardingStatusActionsDialogCP
        open={isActionsOpen}
        onClose={handleCloseActions}
        item={actionsItem}
      />
    </TableContainer>
  )
}
