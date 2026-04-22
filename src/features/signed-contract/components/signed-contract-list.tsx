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
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import SignedContractItem from "./signed-contract-item"

export default function SignedContractList() {
  const { items, error, isLoading } = useAppSelector(
    (state: RootState) => state.signedContract
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
  if (!isLoading && items.length === 0) {
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
            <TableCell>Fecha envío</TableCell>
            <TableCell>Fecha firma</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <SignedContractItem key={row.id} item={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
