import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type TableContainerProps,
} from "@mui/material"
import React, { useEffect } from "react"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
import type { CeoLeadResumeDetailItem } from "../../../app/services/ceo-operations-summary.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  clearCeoLeadsResumeErrorAct,
  fetchCeoLeadsResumeThunk,
} from "../slice/ceo-operations-summary.slice"

const DETAILS_TABLE_HEIGHT = "min(55vh, 640px)"

const headerCellSx = {
  fontWeight: 600,
  typography: "caption",
  color: "text.secondary",
  letterSpacing: 0.06,
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
}

type LeadDetailsScrollerProps = Omit<TableContainerProps, "ref" | "component">

const leadDetailsTableComponents: TableComponents<CeoLeadResumeDetailItem> = {
  Scroller: React.forwardRef<HTMLDivElement, LeadDetailsScrollerProps>(({ sx, ...rest }, ref) => (
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
      <TableCell colSpan={7} padding="normal" sx={{ border: "none", py: 6 }}>
        <Stack alignItems="center" spacing={1.5} sx={{ py: 2 }}>
          <InboxOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} aria-hidden />
          <Typography variant="subtitle1" color="text.primary" align="center">
            No leads found for selected range
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  ),
}

type CeoLeadsResumePanelProps = {
  fromIso: string
  toMonolithIso: string
  isEnabled: boolean
  includeDetails: boolean
  onToggleIncludeDetails: (checked: boolean) => void
}

export default function CeoLeadsResumePanelCP({
  fromIso,
  toMonolithIso,
  isEnabled,
  includeDetails,
  onToggleIncludeDetails,
}: CeoLeadsResumePanelProps) {
  const dispatch = useAppDispatch()
  const { leadsResume, isLeadsResumeLoading, leadsResumeError } = useAppSelector(
    (state: RootState) => state.ceoOperationsSummary
  )
  useEffect(() => {
    if (!isEnabled) {
      return
    }
    void dispatch(
      fetchCeoLeadsResumeThunk({
        fromIso,
        toMonolithIso,
        includeDetails,
      })
    )
  }, [dispatch, fromIso, includeDetails, isEnabled, toMonolithIso])
  return (
    <Stack spacing={1.25}>
      <FormControlLabel
        control={
          <Checkbox
            checked={includeDetails}
            onChange={(event) => onToggleIncludeDetails(event.target.checked)}
          />
        }
        label="Show lead details (name, phone, email)"
      />
      {leadsResumeError !== null && (
        <Alert severity="error" onClose={() => dispatch(clearCeoLeadsResumeErrorAct())}>
          {leadsResumeError}
        </Alert>
      )}
      {isLeadsResumeLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <Box
        sx={{
          display: "grid",
          gap: 1.25,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
        }}
      >
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Total Leads
          </Typography>
          <Typography variant="h6">{leadsResume?.totals.totalLeads ?? 0}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Answered Calls
          </Typography>
          <Typography variant="h6">{leadsResume?.totals.answeredCallsTotal ?? 0}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Call Voicemail
          </Typography>
          <Typography variant="h6">{leadsResume?.totals.voicemailTotal ?? 0}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Accepted Training
          </Typography>
          <Typography variant="h6">{leadsResume?.totals.acceptedTrainingTotal ?? 0}</Typography>
        </Paper>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Day</TableCell>
              <TableCell sx={headerCellSx}>Total Leads</TableCell>
              <TableCell sx={headerCellSx}>Answered Calls</TableCell>
              <TableCell sx={headerCellSx}>Voicemail</TableCell>
              <TableCell sx={headerCellSx}>Accepted Training</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(leadsResume?.byDay ?? []).map((item) => (
              <TableRow key={item.day}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.totalLeads}</TableCell>
                <TableCell>{item.answeredCallsTotal}</TableCell>
                <TableCell>{item.voicemailTotal}</TableCell>
                <TableCell>{item.acceptedTrainingTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {includeDetails && (
        <Box sx={{ position: "relative", height: DETAILS_TABLE_HEIGHT }}>
          <TableVirtuoso
            style={{ height: "100%" }}
            data={leadsResume?.details ?? []}
            components={leadDetailsTableComponents}
            overscan={12}
            computeItemKey={(_index, item) => `${item.day}-${item.phone}-${item.email}-${item.leadName}`}
            fixedHeaderContent={() => (
              <TableRow sx={{ bgcolor: "background.paper" }}>
                <TableCell sx={headerCellSx}>Day</TableCell>
                <TableCell sx={headerCellSx}>Lead Name</TableCell>
                <TableCell sx={headerCellSx}>Phone</TableCell>
                <TableCell sx={headerCellSx}>Email</TableCell>
                <TableCell sx={headerCellSx}>Answered Call</TableCell>
                <TableCell sx={headerCellSx}>Voicemail</TableCell>
                <TableCell sx={headerCellSx}>Accepted Training</TableCell>
              </TableRow>
            )}
            itemContent={(_index, item) => (
              <>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.leadName}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.answeredCall ? "Yes" : "No"}</TableCell>
                <TableCell>{item.voicemail ? "Yes" : "No"}</TableCell>
                <TableCell>{item.acceptedTraining ? "Yes" : "No"}</TableCell>
              </>
            )}
          />
        </Box>
      )}
    </Stack>
  )
}
