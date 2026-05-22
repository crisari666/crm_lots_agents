import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { buildSignedContractDisplayRows } from "../utils/build-signed-contract-display-rows"
import SignedContractItem from "./signed-contract-item"
import SignedContractSummary from "./signed-contract-summary"

const compactTableSx = {
  "& .MuiTableCell-root": {
    py: 0.5,
    px: 1,
    fontSize: "0.8125rem",
  },
  "& .MuiTableCell-head": {
    py: 0.75,
    fontWeight: 600,
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
  },
} as const

export default function SignedContractList() {
  const { items, error, isLoading, groupRepeatedByEmail, signStatusFilter } =
    useAppSelector((state: RootState) => state.signedContract)
  const displayRows = useMemo(
    () =>
      buildSignedContractDisplayRows({
        items,
        signStatusFilter,
        groupRepeatedByEmail,
      }),
    [items, groupRepeatedByEmail, signStatusFilter],
  )
  if (error != null && error !== "") {
    return <Alert severity="error">{error}</Alert>
  }
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }
  if (!isLoading && displayRows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Sin registros. Ajusta fechas y pulsa Filtrar, o deja fechas vacías para los últimos envíos.
      </Typography>
    )
  }
  return (
    <Stack spacing={1}>
      <SignedContractSummary />
      <TableContainer component={Paper}>
      <Table size="small" stickyHeader sx={compactTableSx}>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Enlace para firmar</TableCell>
            {groupRepeatedByEmail ? (
              <TableCell align="right">Envíos</TableCell>
            ) : null}
            <TableCell>Fecha envío</TableCell>
            <TableCell>Fecha firma</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Abrir firmado</TableCell>
            {!groupRepeatedByEmail ? (
              <TableCell align="center" width={56}>
                Marcar
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayRows.map((row) => (
            <SignedContractItem
              key={row.id}
              item={row}
              showSendCountColumn={groupRepeatedByEmail}
              showMarkSignedColumn={!groupRepeatedByEmail}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Stack>
  )
}
