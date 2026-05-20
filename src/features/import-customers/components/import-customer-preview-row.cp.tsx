import {
  Box,
  TableCell,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Info from "@mui/icons-material/Info"
import ErrorOutline from "@mui/icons-material/ErrorOutline"
import UserInterface from "../../../app/models/user-interface"
import AssignUserAutocompleteCP from "../../customer-v2/components/assign-user-autocomplete.cp"
import type { ImportCustomerRowPreview } from "../import-customers.state"
import { importCustomersStrings as s } from "../../../i18n/locales/import-customers.strings"

export type ImportCustomerPreviewRowCPProps = {
  row: ImportCustomerRowPreview
  users: UserInterface[]
  assigneeLoading: boolean
  onAssigneeChange: (assignedTo: string) => void
}

function RowStatus({ row }: { row: ImportCustomerRowPreview }) {
  if (row.status === "created") {
    return (
      <Chip
        size="small"
        icon={<CheckCircle />}
        label={s.statusImported}
        color="success"
        variant="outlined"
      />
    )
  }
  if (row.status === "already_exists") {
    return (
      <Chip
        size="small"
        icon={<Info />}
        label={s.statusAlreadyExists}
        color="warning"
        variant="outlined"
      />
    )
  }
  if (row.status === "error") {
    return (
      <Chip
        size="small"
        icon={<ErrorOutline />}
        label={row.errorMessage ?? s.statusError}
        color="error"
        variant="outlined"
      />
    )
  }
  return (
    <Typography variant="body2" color="text.secondary">
      {s.statusPending}
    </Typography>
  )
}

export default function ImportCustomerPreviewRowCP({
  row,
  users,
  assigneeLoading,
  onAssigneeChange,
}: ImportCustomerPreviewRowCPProps) {
  return (
    <>
      <TableCell>{row.name || "—"}</TableCell>
      <TableCell>{row.phone}</TableCell>
      <TableCell>{row.email || "—"}</TableCell>
      <TableCell sx={{ minWidth: 220 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AssignUserAutocompleteCP
            users={users}
            value={row.assignedTo ?? ""}
            onChange={onAssigneeChange}
            disabled={assigneeLoading}
            label={s.assigneeLabel}
            size="small"
          />
          {assigneeLoading && <CircularProgress size={20} />}
        </Box>
      </TableCell>
      <TableCell align="center">
        <RowStatus row={row} />
      </TableCell>
    </>
  )
}
