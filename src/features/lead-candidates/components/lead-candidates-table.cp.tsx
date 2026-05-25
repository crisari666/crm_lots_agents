import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import LoadingIndicator from "../../../app/components/loading-indicator"
import { fetchLeadCandidateDetailThunk } from "../slice/lead-candidates.slice"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleString()
}

function formatName(name: string, lastName: string): string {
  return `${name} ${lastName}`.trim()
}

export default function LeadCandidatesTableCp() {
  const dispatch = useAppDispatch()
  const { items, isLoadingRows, total } = useAppSelector((state) => state.leadCandidates)

  const handleRowClick = (id: string): void => {
    void dispatch(fetchLeadCandidateDetailThunk(id))
  }

  return (
    <>
      <LoadingIndicator open={isLoadingRows} />
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5, display: "block" }}>
          {total} registro{total === 1 ? "" : "s"}
        </Typography>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>{s.columns.createdAt}</TableCell>
                <TableCell>{s.columns.name}</TableCell>
                <TableCell>{s.columns.email}</TableCell>
                <TableCell>{s.columns.phone}</TableCell>
                <TableCell>{s.columns.sourceType}</TableCell>
                <TableCell>{s.columns.status}</TableCell>
                <TableCell>{s.columns.promotedUserId}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 && !isLoadingRows ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {s.emptyList}
                  </TableCell>
                </TableRow>
              ) : null}
              {items.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleRowClick(row.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatName(row.name, row.lastName)}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.sourceType}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.promotedUserId ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
