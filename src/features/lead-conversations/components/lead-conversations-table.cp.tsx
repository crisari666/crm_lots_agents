import React, { useEffect } from "react"
import {
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import { ForumOutlined } from "@mui/icons-material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import {
  fetchLeadConversationMessagesThunk,
  fetchLeadConversationsThunk,
  selectLeadConversationAct,
  setLeadConversationsFiltersAct,
} from "../slice/lead-conversations.slice"
import type { LeadConversationListItem } from "../types/lead-conversations.types"
import {
  LeadConversationScoreCP,
  LeadConversationStatusChipCP,
  LeadConversationStepChipCP,
} from "./lead-conversation-chips.cp"

const COLUMN_COUNT = 6
const SKELETON_ROWS = 6
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50]

const resolveProjectLabel = (item: LeadConversationListItem): string =>
  item.isAllProjects ? s.allProjects : (item.projectTitle ?? s.noProject)

function LoadingRows(): React.ReactElement {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: COLUMN_COUNT }, (__, cell) => (
            <TableCell key={cell}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function EmptyState(): React.ReactElement {
  return (
    <TableRow>
      <TableCell colSpan={COLUMN_COUNT}>
        <Box sx={{ py: 6, textAlign: "center" }}>
          <ForumOutlined sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
            {s.emptyTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {s.emptyHint}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default function LeadConversationsTableCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const { items, total, loading, error, filters, selectedSessionId } = useAppSelector(
    (state) => state.leadConversations
  )
  useEffect(() => {
    void dispatch(fetchLeadConversationsThunk())
  }, [dispatch])
  const openConversation = (sessionId: string) => {
    dispatch(selectLeadConversationAct(sessionId))
    void dispatch(fetchLeadConversationMessagesThunk({ sessionId }))
  }
  const onChangePage = (_: unknown, page: number) => {
    dispatch(setLeadConversationsFiltersAct({ page }))
    void dispatch(fetchLeadConversationsThunk())
  }
  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = Number(event.target.value) as 10 | 20 | 50
    dispatch(setLeadConversationsFiltersAct({ limit, page: 0 }))
    void dispatch(fetchLeadConversationsThunk())
  }
  return (
    <Paper variant="outlined">
      {error ? (
        <Alert
          severity="error"
          sx={{ m: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => void dispatch(fetchLeadConversationsThunk())}>
              {s.retry}
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {s.resultCount(total)}
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.colCustomer}</TableCell>
              <TableCell>{s.colProject}</TableCell>
              <TableCell>{s.colStep}</TableCell>
              <TableCell>{s.colStatus}</TableCell>
              <TableCell>{s.colScore}</TableCell>
              <TableCell>{s.colLastMessage}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? <LoadingRows /> : null}
            {!loading && items.length === 0 && !error ? <EmptyState /> : null}
            {items.map((item) => (
              <TableRow
                key={item.sessionId}
                hover
                selected={item.sessionId === selectedSessionId}
                onClick={() => openConversation(item.sessionId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") openConversation(item.sessionId)
                }}
                tabIndex={0}
                sx={{ cursor: "pointer", opacity: loading ? 0.6 : 1, transition: "opacity 150ms" }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {item.customerName || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.phone}
                  </Typography>
                </TableCell>
                <TableCell>{resolveProjectLabel(item)}</TableCell>
                <TableCell>
                  <LeadConversationStepChipCP step={item.step} />
                </TableCell>
                <TableCell>
                  <LeadConversationStatusChipCP status={item.status} />
                </TableCell>
                <TableCell>
                  <LeadConversationScoreCP score={item.score} maxScore={item.maxScore} priority={item.priority} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" title={item.lastInboundAt ? moment(item.lastInboundAt).format("LLL") : ""}>
                    {item.lastInboundAt ? moment(item.lastInboundAt).fromNow() : "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={filters.page}
        rowsPerPage={filters.limit}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Paper>
  )
}
