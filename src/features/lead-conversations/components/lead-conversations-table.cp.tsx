import React, { useEffect } from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
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
import { ForumOutlined } from "@mui/icons-material"
import moment from "moment"
import ProjectChipsCP from "../../../app/components/project-chips.cp"
import TableColumnPickerCP, {
  type TableColumnPickerOption,
} from "../../../app/components/table-column-picker.cp"
import { useTableColumnVisibility } from "../../../app/hooks/use-table-column-visibility"
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
  LeadConversationTemperatureChipCP,
} from "./lead-conversation-chips.cp"

const SKELETON_ROWS = 6
const ROWS_PER_PAGE_OPTIONS = [10, 20, 50]
const COLUMN_VISIBILITY_STORAGE_KEY = "crm.leadConversations.columnVisibility.v1"

const CONVERSATION_COLUMN_OPTIONS: readonly TableColumnPickerOption[] = [
  { id: "customer", label: s.colCustomer },
  { id: "project", label: s.colProject },
  { id: "step", label: s.colStep },
  { id: "status", label: s.colStatus },
  { id: "score", label: s.colScore },
  { id: "lastMessage", label: s.colLastMessage },
]

const CONVERSATION_DEFAULT_VISIBILITY = Object.fromEntries(
  CONVERSATION_COLUMN_OPTIONS.map((column) => [column.id, true])
) as Record<string, boolean>

function LoadingRows({ columnCount }: { readonly columnCount: number }): React.ReactElement {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: columnCount }, (__, cell) => (
            <TableCell key={cell}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function EmptyState({ columnCount }: { readonly columnCount: number }): React.ReactElement {
  return (
    <TableRow>
      <TableCell colSpan={columnCount}>
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

function ProjectCell({ item }: { readonly item: LeadConversationListItem }): React.ReactElement {
  return (
    <ProjectChipsCP
      projectTitle={item.projectTitle}
      isAllProjects={item.isAllProjects}
      emptyLabel={s.noProject}
      allProjectsLabel={s.allProjects}
    />
  )
}

export default function LeadConversationsTableCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const { items, total, loading, error, filters, selectedSessionId } = useAppSelector(
    (state) => state.leadConversations
  )
  const { visibility, isVisible, setColumnVisible, visibleCount } = useTableColumnVisibility({
    storageKey: COLUMN_VISIBILITY_STORAGE_KEY,
    defaultVisibility: CONVERSATION_DEFAULT_VISIBILITY,
  })
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
      <Box
        sx={{
          px: 2,
          pt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {s.resultCount(total)}
        </Typography>
        <TableColumnPickerCP
          columns={CONVERSATION_COLUMN_OPTIONS}
          visibility={visibility}
          onChange={setColumnVisible}
          menuLabel={s.columnsMenu}
        />
      </Box>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {isVisible("customer") ? <TableCell>{s.colCustomer}</TableCell> : null}
              {isVisible("project") ? <TableCell>{s.colProject}</TableCell> : null}
              {isVisible("step") ? <TableCell>{s.colStep}</TableCell> : null}
              {isVisible("status") ? <TableCell>{s.colStatus}</TableCell> : null}
              {isVisible("score") ? <TableCell>{s.colScore}</TableCell> : null}
              {isVisible("lastMessage") ? <TableCell>{s.colLastMessage}</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? <LoadingRows columnCount={visibleCount} /> : null}
            {!loading && items.length === 0 && !error ? (
              <EmptyState columnCount={visibleCount} />
            ) : null}
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
                {isVisible("customer") ? (
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {item.customerName || "—"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.phone}
                    </Typography>
                  </TableCell>
                ) : null}
                {isVisible("project") ? (
                  <TableCell>
                    <ProjectCell item={item} />
                  </TableCell>
                ) : null}
                {isVisible("step") ? (
                  <TableCell>
                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                      <LeadConversationStepChipCP step={item.step} />
                      {item.flowVersion === "v2" ? (
                        <Chip size="small" color="success" label={s.flowChipV2} />
                      ) : null}
                      {item.temperature ? (
                        <LeadConversationTemperatureChipCP temperature={item.temperature} />
                      ) : null}
                    </Stack>
                  </TableCell>
                ) : null}
                {isVisible("status") ? (
                  <TableCell>
                    <LeadConversationStatusChipCP status={item.status} />
                  </TableCell>
                ) : null}
                {isVisible("score") ? (
                  <TableCell>
                    <LeadConversationScoreCP
                      score={item.score}
                      maxScore={item.maxScore}
                      priority={item.priority}
                    />
                  </TableCell>
                ) : null}
                {isVisible("lastMessage") ? (
                  <TableCell>
                    <Typography
                      variant="body2"
                      title={item.lastInboundAt ? moment(item.lastInboundAt).format("LLL") : ""}
                    >
                      {item.lastInboundAt ? moment(item.lastInboundAt).fromNow() : "—"}
                    </Typography>
                  </TableCell>
                ) : null}
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
