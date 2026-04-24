import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Link from "@mui/material/Link"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Tooltip from "@mui/material/Tooltip"
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
  showSendCountColumn,
}: {
  readonly item: SignedContractListItem
  readonly showSendCountColumn: boolean
}) {
  return (
    <TableRow hover>
      <TableCell>{item.userEmail}</TableCell>
      <TableCell>{item.name}</TableCell>
      {showSendCountColumn ? (
        <TableCell align="right">{item.sendCount ?? 1}</TableCell>
      ) : null}
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
      <TableCell align="center">
        {item.signedPdfLink != null && item.signedPdfLink !== "" ? (
          <Tooltip title="Abrir PDF firmado en nueva pestaña">
            <IconButton
              component={Link}
              href={item.signedPdfLink}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="primary"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          "—"
        )}
      </TableCell>
    </TableRow>
  )
}
