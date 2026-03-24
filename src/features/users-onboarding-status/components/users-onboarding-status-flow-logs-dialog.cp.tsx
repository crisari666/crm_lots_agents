import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { selectHistoryFlowLogsState } from "../slice/users-onboarding-status.slice"
import {
  onboardingFlowEventLabel,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import { rowsFromOnboardingFlowDetails } from "../utils/onboarding-flow-details.utils"

type UsersOnboardingStatusFlowLogsDialogCPProps = {
  open: boolean
  onClose: () => void
}

export default function UsersOnboardingStatusFlowLogsDialogCP({
  open,
  onClose
}: UsersOnboardingStatusFlowLogsDialogCPProps) {
  const { detail, isLoading, error } = useAppSelector(selectHistoryFlowLogsState)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{s.flowLogsDialogTitle}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 3
            }}
          >
            <CircularProgress size={32} />
            <Typography variant="body2">{s.flowLogsLoading}</Typography>
          </Box>
        ) : null}

        {!isLoading && error ? <Alert severity="error">{error}</Alert> : null}

        {!isLoading && !error && detail ? (
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {s.flowLogsMetaName}
              </Typography>
              <Typography variant="body2">{detail.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {s.flowLogsMetaPhone}
              </Typography>
              <Typography variant="body2">{detail.phoneNumber}</Typography>
              {detail.createdAt ? (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {s.flowLogsMetaCreated}
                  </Typography>
                  <Typography variant="body2">{dateUTCToFriendly(detail.createdAt)}</Typography>
                </>
              ) : null}
              {detail.updatedAt ? (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {s.flowLogsMetaUpdated}
                  </Typography>
                  <Typography variant="body2">{dateUTCToFriendly(detail.updatedAt)}</Typography>
                </>
              ) : null}
            </Stack>

            {Object.keys(detail.whatsappMessageIds ?? {}).length > 0 ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {s.flowLogsWhatsappIds}
                </Typography>
                <Stack spacing={0.5}>
                  {Object.entries(detail.whatsappMessageIds ?? {}).map(([key, val]) =>
                    val ? (
                      <Typography key={key} variant="body2" component="div">
                        <Typography component="span" variant="caption" color="text.secondary">
                          {key}:{" "}
                        </Typography>
                        {String(val)}
                      </Typography>
                    ) : null
                  )}
                </Stack>
              </Box>
            ) : null}

            {detail.events.length === 0 ? (
              <Typography variant="body2">{s.flowLogsNoEvents}</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "28%" }}>{s.flowLogsColWhen}</TableCell>
                    <TableCell sx={{ width: "32%" }}>{s.flowLogsColEvent}</TableCell>
                    <TableCell>{s.flowLogsColDetails}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detail.events.map((ev, index) => {
                    const detailRows = rowsFromOnboardingFlowDetails(ev.details)
                    return (
                      <TableRow key={`${ev.date}-${ev.event}-${index}`}>
                        <TableCell>{dateUTCToFriendly(ev.date)}</TableCell>
                        <TableCell>{onboardingFlowEventLabel(ev.event)}</TableCell>
                        <TableCell>
                          {detailRows.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          ) : (
                            <Stack spacing={1}>
                              {detailRows.map((row) => (
                                <Box key={row.fieldKey}>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.label}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    component="pre"
                                    sx={{
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                      fontFamily: "inherit",
                                      m: 0
                                    }}
                                  >
                                    {row.value}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {s.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
