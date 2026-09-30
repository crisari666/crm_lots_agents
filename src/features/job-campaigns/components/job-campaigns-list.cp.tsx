import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignAdminItem } from "../types/job-campaign.types"

type Props = {
  readonly items: readonly JobCampaignAdminItem[]
  readonly loading: boolean
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
  readonly onCreate: () => void
  readonly onActivate: (id: string) => void
  readonly onEditSetup: (id: string) => void
}

export function JobCampaignsListCp(props: Props) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">{s.pageTitle}</Typography>
        <Button variant="contained" onClick={props.onCreate}>
          {s.newCampaign}
        </Button>
      </Stack>
      {props.loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={28} />
        </Box>
      ) : props.items.length === 0 ? (
        <Typography color="text.secondary">{s.listEmpty}</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.fieldName}</TableCell>
              <TableCell>{s.candidates}</TableCell>
              <TableCell>{s.availableSlots}</TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items.map((item) => (
              <TableRow
                key={item.id}
                hover
                selected={props.selectedId === item.id}
                onClick={() => props.onSelect(item.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{item.name}</span>
                    {item.isActive ? (
                      <Chip size="small" color="success" label={s.activeBadge} />
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell>{item.candidateCount}</TableCell>
                <TableCell>{item.availableInterviewCount}</TableCell>
                <TableCell>{item.enabled ? "enabled" : "disabled"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Stack direction="row" spacing={1}>
                    {!item.isActive ? (
                      <Button
                        size="small"
                        onClick={() => props.onActivate(item.id)}
                      >
                        {s.activate}
                      </Button>
                    ) : null}
                    <Button
                      size="small"
                      onClick={() => props.onEditSetup(item.id)}
                    >
                      {s.editSetup}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  )
}
