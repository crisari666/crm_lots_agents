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
import Typography from "@mui/material/Typography"
import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { groupSignedContractsByEmail } from "../utils/group-signed-contracts-by-email"
import SignedContractItem from "./signed-contract-item"

export default function SignedContractList() {
  const { items, error, isLoading, groupRepeatedByEmail, onlySigned } = useAppSelector(
    (state: RootState) => state.signedContract,
  )
  const displayRows = useMemo(() => {
    const filteredItems = onlySigned ? items.filter((item) => item.signed) : items
    if (groupRepeatedByEmail) {
      return groupSignedContractsByEmail(filteredItems)
    }
    return filteredItems
  }, [items, groupRepeatedByEmail, onlySigned])
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
    <TableContainer component={Paper} sx={{ mt: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Nombre</TableCell>
            {groupRepeatedByEmail ? (
              <TableCell align="right">Envíos</TableCell>
            ) : null}
            <TableCell>Fecha envío</TableCell>
            <TableCell>Fecha firma</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Abrir firmado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayRows.map((row) => (
            <SignedContractItem
              key={row.id}
              item={row}
              showSendCountColumn={groupRepeatedByEmail}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
