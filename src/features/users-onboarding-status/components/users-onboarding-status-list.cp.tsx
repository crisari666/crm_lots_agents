import {
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  type TableContainerProps,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material"
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import HistoryIcon from "@mui/icons-material/History"
import TouchAppIcon from "@mui/icons-material/TouchApp"
import { alpha } from "@mui/material/styles"
import React, { useState } from "react"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
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
import type {
  OnboardingStateType,
  OnboardingStatusType,
  OnboardingUserType
} from "../types/onboarding-state.types"
import { isOrphanOnboardingListRow } from "../types/onboarding-state.types"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import UsersOnboardingStatusHistoryDialogCP from "./users-onboarding-status-history-dialog.cp"
import UsersOnboardingStatusActionsDialogCP from "./users-onboarding-status-actions-dialog.cp"
import {
  onboardingStatusFilterI18n,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"

type UsersOnboardingStatusListCPProps = {
  onOpenWhatsappChat: (user: OnboardingUserType) => void
}

const ONBOARDING_LIST_TABLE_HEIGHT = "min(70vh, 720px)"

function onboardingStatusLabel(status: string) {
  const localized = onboardingStatusFilterI18n[status as OnboardingStatusType]
  return localized?.title ?? status
}

function onboardingStatusChipColor(
  status: string
): "default" | "success" | "error" | "warning" {
  if (status === "Call_failed" || status === "Needs_human_whatsapp") return "error"
  if (status === "Confirmed_training_request" || status === "Call_done_success") return "success"
  if (status === "Call_voicemail" || status === "Reschedule_due_twilio_number_occupiedt") {
    return "warning"
  }
  return "default"
}

const headerCellSx = {
  fontWeight: 600,
  typography: "caption",
  color: "text.secondary",
  letterSpacing: 0.06,
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
  borderBottomColor: "divider"
}

type OnboardingListScrollerProps = Omit<TableContainerProps, "ref" | "component">

const onboardingListTableComponents: TableComponents<OnboardingStateType> = {
  Scroller: React.forwardRef<HTMLDivElement, OnboardingListScrollerProps>(({ sx, ...rest }, ref) => (
    <TableContainer
      component={Paper}
      variant="outlined"
      ref={ref}
      {...rest}
      sx={[{ borderRadius: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    />
  )),
  Table: (props) => <Table {...props} size="small" sx={{ borderCollapse: "separate" }} />,
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} hover />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
  EmptyPlaceholder: () => (
    <TableRow>
      <TableCell colSpan={10} padding="normal" sx={{ border: "none", py: 6 }}>
        <Stack alignItems="center" spacing={1.5} sx={{ py: 2 }}>
          <InboxOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} aria-hidden />
          <Typography variant="subtitle1" color="text.primary" align="center">
            {s.listNoUsersFound}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 360 }}>
            {s.listEmptyStateHint}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  )
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
    return (
      <Alert severity="error" variant="outlined" sx={{ borderRadius: 1 }}>
        {error}
      </Alert>
    )
  }

  return (
    <>
      <Box sx={{ position: "relative", height: ONBOARDING_LIST_TABLE_HEIGHT }}>
        {isLoading ? (
          <Box
            role="progressbar"
            aria-label={s.listLoadingLabel}
            aria-busy="true"
            sx={(theme) => ({
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.background.paper, 0.75),
              backdropFilter: "blur(2px)",
              zIndex: 1
            })}
          >
            <CircularProgress />
          </Box>
        ) : null}

        <TableVirtuoso
          style={{ height: "100%" }}
          data={items}
          components={onboardingListTableComponents}
          overscan={12}
          computeItemKey={(_index, x) => x._id ?? `${x.createdAt}-${x.lastUpdate}`}
          fixedHeaderContent={() => (
            <TableRow
              sx={{
                bgcolor: "background.paper",
                boxShadow: (theme) => theme.shadows[2],
                "& th": { borderBottomColor: "divider" }
              }}
            >
              <TableCell padding="checkbox" sx={headerCellSx}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
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
                  <Box component="span" sx={headerCellSx}>
                    {s.listHeaderOrphanSelect}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell padding="checkbox" sx={headerCellSx}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
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
                  <Box component="span" sx={headerCellSx}>
                    {s.listHeaderRescheduleSelect}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell sx={headerCellSx}>{s.listColUser}</TableCell>
              <TableCell sx={{ ...headerCellSx, maxWidth: 220 }}>{s.listColEmail}</TableCell>
              <TableCell sx={{ ...headerCellSx, maxWidth: 140 }}>{s.listColWhatsApp}</TableCell>
              <TableCell sx={headerCellSx}>{s.listColStatus}</TableCell>
              <TableCell sx={{ ...headerCellSx, minWidth: 120 }}>{s.listColLastUpdate}</TableCell>
              <TableCell align="center" sx={headerCellSx}>
                {s.actionsOpen}
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                {s.listColHistory}
              </TableCell>
              <TableCell align="center" sx={headerCellSx}>
                {s.whatsappChatOpen}
              </TableCell>
            </TableRow>
          )}
          itemContent={(_index, x) => {
            const orphan = isOrphanOnboardingListRow(x)
            const stateId = x._id
            const userMongoId = x.userId?._id
            const fullName = x.userId ? `${x.userId.name} ${x.userId.lastName}`.trim() : ""
            const email = x.userId?.email?.trim() ?? ""
            const phone = x.userId?.phone?.trim() ?? ""
            const hasPhone = Boolean(phone)
            const statusLabel = onboardingStatusLabel(x.status)
            const chipColor = onboardingStatusChipColor(x.status)
            return (
              <>
                <TableCell padding="checkbox" sx={{ verticalAlign: "middle" }}>
                  {orphan && stateId ? (
                    <Checkbox
                      size="small"
                      checked={selectedOrphanIds.includes(stateId)}
                      onChange={() => dispatch(toggleOrphanOnboardingRowSelectedAct(stateId))}
                      inputProps={{ "aria-label": s.listSelectOrphanRowA11y }}
                    />
                  ) : null}
                </TableCell>
                <TableCell padding="checkbox" sx={{ verticalAlign: "middle" }}>
                  {userMongoId ? (
                    <Checkbox
                      size="small"
                      checked={selectedRescheduleUserIds.includes(userMongoId)}
                      onChange={() => dispatch(toggleRescheduleUserSelectedAct(userMongoId))}
                      inputProps={{ "aria-label": s.listSelectUserForRescheduleA11y }}
                    />
                  ) : null}
                </TableCell>
                <TableCell sx={{ maxWidth: 200, verticalAlign: "middle" }}>
                  {fullName ? (
                    <Tooltip title={fullName}>
                      <Typography variant="body2" noWrap>
                        {fullName}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {s.listEmptyCell}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  sx={{ maxWidth: 220, verticalAlign: "middle" }}
                >
                  {email ? (
                    <Tooltip title={email}>
                      <Typography variant="body2" component="span" noWrap display="block">
                        {email}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {s.listEmptyCell}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ maxWidth: 140, verticalAlign: "middle" }}>
                  {phone ? (
                    <Tooltip title={phone}>
                      <Typography
                        variant="body2"
                        component="span"
                        noWrap
                        display="block"
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {phone}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {s.listEmptyCell}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ verticalAlign: "middle", minWidth: 140 }}>
                  <Tooltip title={statusLabel}>
                    <Chip
                      label={statusLabel}
                      size="small"
                      color={chipColor}
                      variant={chipColor === "default" ? "outlined" : "filled"}
                      sx={{
                        maxWidth: "100%",
                        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  <Typography variant="body2" color="text.secondary">
                    {dateUTCToFriendly(x.lastUpdate)}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                  <Tooltip title={x.userId ? s.actionsOpen : s.actionsTooltipNoUser}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId}
                        onClick={() => handleOpenActions(x)}
                        aria-label={s.actionsOpen}
                      >
                        <TouchAppIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                  <Tooltip title={x.userId ? s.viewHistory : s.historyTooltipNoUser}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId}
                        onClick={() => handleOpenHistory(x)}
                        aria-label={s.viewHistory}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                  <Tooltip
                    title={
                      !x.userId
                        ? s.whatsappTooltipNoUser
                        : !hasPhone
                          ? s.whatsappTooltipNoPhone
                          : s.whatsappChatOpen
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        disabled={!x.userId || !hasPhone}
                        onClick={() => x.userId != null && onOpenWhatsappChat(x.userId)}
                        aria-label={s.whatsappChatOpen}
                      >
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </>
            )
          }}
        />
      </Box>

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
    </>
  )
}
