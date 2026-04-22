import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import Chip from "@mui/material/Chip"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import type { SignedContractListItem } from "../types/signed-contract.types"

function formatDateTime(iso: string | null): string {
  if (iso == null || iso === "") {
    return "—"
  }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return "—"
  }
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

export default function SignedContractItem({
  item,
}: {
  readonly item: SignedContractListItem
}) {
  return (
    <TableRow hover>
      <TableCell>{item.userEmail}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{formatDateTime(item.dateSent)}</TableCell>
      <TableCell>{formatDateTime(item.dateSigned)}</TableCell>
      <TableCell>
        <Chip
          size="small"
          color={item.signed ? "success" : "warning"}
          variant={item.signed ? "filled" : "outlined"}
          icon={item.signed ? <CheckCircleOutlineIcon /> : <HourglassEmptyIcon />}
          label={item.signed ? "Firmado" : "Pendiente"}
        />
      </TableCell>
    </TableRow>
  )
}
