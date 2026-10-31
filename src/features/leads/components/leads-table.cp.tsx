import React, { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchCustomerAdminDetailThunk } from "../../customer-v2/redux/customer-v2.slice"
import CustomerDetailDialogCP from "../../customer-v2/components/customer-detail-dialog.cp"
import {
  fetchLeadConversationMessagesThunk,
  selectLeadConversationAct,
  setLeadConversationDrawerScheduleAct,
  upsertLeadConversationItemAct,
} from "../../lead-conversations/slice/lead-conversations.slice"
import { mapLeadToConversationItem } from "../business-logic/map-lead-to-conversation-item"
import {
  convertLeadThunk,
  fetchLeadsThunk,
  setLeadsPageAct,
} from "../slice/leads.slice"
import type { LeadListItem } from "../types/leads.types"
import LeadsDetailStripCP from "./leads-detail-strip.cp"
import LeadsSourceChipCP from "./leads-source-chip.cp"

function displayName(item: LeadListItem): string {
  return `${item.name} ${item.lastName}`.trim() || item.phone
}

export default function LeadsTableCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.leads.items)
  const total = useAppSelector((state) => state.leads.total)
  const page = useAppSelector((state) => state.leads.page)
  const limit = useAppSelector((state) => state.leads.limit)
  const loading = useAppSelector((state) => state.leads.loading)
  const error = useAppSelector((state) => state.leads.error)
  const convertingId = useAppSelector((state) => state.leads.convertingId)
  const dialogOpen = useAppSelector((state) => state.customerV2.dialogOpen)
  const users = useAppSelector((state) =>
    state.users.usersOriginal.length > 0 ? state.users.usersOriginal : state.users.users
  )
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const [convertTarget, setConvertTarget] = useState<LeadListItem | null>(null)
  const [assignToUserId, setAssignToUserId] = useState("")
  const [detailLead, setDetailLead] = useState<LeadListItem | null>(null)

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  useEffect(() => {
    if (!dialogOpen) {
      setDetailLead(null)
    }
  }, [dialogOpen])

  const userName = (userId?: string): string => {
    if (!userId) return s.unassigned
    const user = users.find((row) => row._id === userId)
    if (!user) return userId
    return `${user.name ?? ""} ${user.lastName ?? ""}`.trim() || userId
  }

  const openDetail = (item: LeadListItem): void => {
    setDetailLead(item)
    void dispatch(fetchCustomerAdminDetailThunk(item.id))
  }

  const openConversation = (item: LeadListItem): void => {
    const mapped = mapLeadToConversationItem(item)
    if (!mapped) {
      return
    }
    dispatch(upsertLeadConversationItemAct(mapped))
    dispatch(selectLeadConversationAct(mapped.sessionId))
    dispatch(setLeadConversationDrawerScheduleAct(item.scheduledCall ?? null))
    void dispatch(fetchLeadConversationMessagesThunk({ sessionId: mapped.sessionId }))
  }

  const openConvert = (item: LeadListItem): void => {
    setConvertTarget(item)
    setAssignToUserId(item.assignedTo ?? "")
  }

  const confirmConvert = async (): Promise<void> => {
    if (!convertTarget) return
    const customerId = convertTarget.id
    const result = await dispatch(
      convertLeadThunk({
        customerId,
        ...(assignToUserId.trim() ? { assignToUserId: assignToUserId.trim() } : {}),
      })
    )
    setConvertTarget(null)
    setAssignToUserId("")
    if (convertLeadThunk.fulfilled.match(result)) {
      if (detailLead?.id === customerId) {
        setDetailLead(result.payload)
      }
      void dispatch(fetchLeadsThunk())
    }
  }

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => void dispatch(fetchLeadsThunk())}>
            {s.refresh}
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }

  if (items.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {s.emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {s.emptyHint}
        </Typography>
      </Paper>
    )
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.colName}</TableCell>
              <TableCell>{s.colPhone}</TableCell>
              <TableCell>{s.colSources}</TableCell>
              <TableCell>{s.colLifecycle}</TableCell>
              <TableCell>{s.colAssignee}</TableCell>
              <TableCell>{s.colScore}</TableCell>
              <TableCell>{s.colCreated}</TableCell>
              <TableCell align="right">{s.colActions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={() => openDetail(item)}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    {displayName(item)}
                  </MuiLink>
                </TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>
                  <Box>
                    {item.leadSources.map((source) => (
                      <LeadsSourceChipCP key={source} source={source} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={item.isPromoted ? s.lifecycleCustomer : s.lifecycleLead}
                    color={item.isPromoted ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>{userName(item.assignedTo)}</TableCell>
                <TableCell>
                  {item.leadSession?.score !== undefined ? `${item.leadSession.score}` : "—"}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap">
                    <Button size="small" onClick={() => openDetail(item)} sx={{ cursor: "pointer" }}>
                      {s.openDetail}
                    </Button>
                    {item.leadSession?.sessionId ? (
                      <Button
                        size="small"
                        onClick={() => openConversation(item)}
                        sx={{ cursor: "pointer" }}
                      >
                        {s.openSession}
                      </Button>
                    ) : null}
                    {!item.isPromoted ? (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={convertingId === item.id}
                        onClick={() => openConvert(item)}
                        sx={{ cursor: "pointer" }}
                      >
                        {s.convert}
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        {s.promoted}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_event, nextPage) => {
          dispatch(setLeadsPageAct(nextPage))
          void dispatch(fetchLeadsThunk())
        }}
        rowsPerPage={limit}
        rowsPerPageOptions={[limit]}
      />
      <CustomerDetailDialogCP
        leadStrip={
          detailLead ? (
            <LeadsDetailStripCP
              lead={detailLead}
              converting={convertingId === detailLead.id}
              onConvert={() => openConvert(detailLead)}
            />
          ) : undefined
        }
      />
      <Dialog open={convertTarget !== null} onClose={() => setConvertTarget(null)}>
        <DialogTitle>{s.convertConfirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>{s.convertConfirmBody}</DialogContentText>
          <FormControl fullWidth size="small">
            <InputLabel id="leads-convert-assign-label">{s.assignOptional}</InputLabel>
            <Select
              labelId="leads-convert-assign-label"
              label={s.assignOptional}
              value={assignToUserId}
              onChange={(event) => setAssignToUserId(String(event.target.value))}
            >
              <MenuItem value="">{s.unassigned}</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {`${user.name ?? ""} ${user.lastName ?? ""}`.trim() || user._id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={() => void confirmConvert()} sx={{ cursor: "pointer" }}>
            {s.convert}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
