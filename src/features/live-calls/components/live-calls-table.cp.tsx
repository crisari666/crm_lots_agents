import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { compactCellSx } from "../constants/live-calls.constants"
import LiveCallsTableRowCP from "./live-calls-table-row.cp"

export default function LiveCallsTableCP() {
  const callSids = useAppSelector((s) => s.liveCalls.items.map((c) => c.callSid))
  const loading = useAppSelector((s) => s.liveCalls.loading)
  const isEmpty = callSids.length === 0

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
      <Table size="small" sx={{ "& .MuiTableCell-root": compactCellSx }}>
        <TableHead>
          <TableRow>
            <TableCell>Inicio</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Números</TableCell>
            <TableCell>Agente</TableCell>
            <TableCell>Coach</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && isEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  Cargando…
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && isEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary">
                  No hay llamadas activas en este momento.
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
          {callSids.map((callSid) => (
            <LiveCallsTableRowCP key={callSid} callSid={callSid} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
