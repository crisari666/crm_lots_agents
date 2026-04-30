import * as React from "react"
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  selectReferralFollowUpState,
} from "../slice/referral-follow-up.slice"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import {
  referralFollowUpStrings as s,
  referralSituationEventLabels,
} from "../../../i18n/locales/referral-follow-up.strings"

export default function ReferralFollowUpListCp() {
  const { rows, isLoadingRows } = useAppSelector((state: RootState) =>
    selectReferralFollowUpState(state),
  )
  if (isLoadingRows) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }
  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        {s.emptyList}
      </Typography>
    )
  }
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{s.columns.userName}</TableCell>
            <TableCell>{s.columns.situation}</TableCell>
            <TableCell>{s.columns.description}</TableCell>
            <TableCell>{s.columns.date}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.userName}</TableCell>
              <TableCell>
                {referralSituationEventLabels[row.event] ?? row.event}
              </TableCell>
              <TableCell sx={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>
                {row.description}
              </TableCell>
              <TableCell>{dateUTCToFriendly(row.date, true)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
