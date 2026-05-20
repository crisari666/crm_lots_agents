import React, { useCallback, useMemo } from "react"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from "@mui/material"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Info from "@mui/icons-material/Info"
import ErrorOutline from "@mui/icons-material/ErrorOutline"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import {
  assignCustomerAssigneeThunk,
  updateRowAssigneeAct,
} from "../import-customers.slice"
import {
  selectPhysicalUsersForImport,
} from "../import-customers.selectors"
import type { ImportCustomerRowPreview } from "../import-customers.state"
import { normalizeImportPhone } from "../utils/normalize-import-phone.util"
import ImportCustomerPreviewRowCP from "./import-customer-preview-row.cp"
import { importCustomersStrings as s } from "../../../i18n/locales/import-customers.strings"

const PREVIEW_TABLE_HEIGHT = 400

const VirtuosoTableComponents: TableComponents<ImportCustomerRowPreview> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} elevation={2} {...props} ref={ref} />
  )),
  Table: (props) => <Table {...props} size="small" sx={{ borderCollapse: "separate" }} />,
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
}

export default function ImportCustomersPreviewTable() {
  const dispatch = useAppDispatch()
  const previewRows = useAppSelector((state: RootState) => state.importCustomers.previewRows)
  const assigneePatchLoadingByPhone = useAppSelector(
    (state: RootState) => state.importCustomers.assigneePatchLoadingByPhone,
  )
  const gotUsers = useAppSelector((state: RootState) => state.users.gotUsers)
  const physicalUsers = useAppSelector(selectPhysicalUsersForImport)

  React.useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const summary = useMemo(() => {
    return previewRows.reduce(
      (acc, row) => {
        if (row.status === "created") {
          acc.created += 1
          return acc
        }
        if (row.status === "already_exists") {
          acc.alreadyExists += 1
          return acc
        }
        if (row.status === "error") {
          acc.errors += 1
          return acc
        }
        acc.pending += 1
        return acc
      },
      { created: 0, alreadyExists: 0, errors: 0, pending: 0 },
    )
  }, [previewRows])

  const handleAssigneeChange = useCallback(
    (row: ImportCustomerRowPreview, assignedTo: string) => {
      const phoneKey = normalizeImportPhone(row.phone)
      if (row.customerId) {
        void dispatch(
          assignCustomerAssigneeThunk({
            customerId: row.customerId,
            assignedTo,
            phoneKey,
          }),
        )
        return
      }
      dispatch(updateRowAssigneeAct({ phone: row.phone, assignedTo }))
    },
    [dispatch],
  )

  if (previewRows.length === 0) {
    return null
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {s.summaryLabel}
        </Typography>
        <Chip
          size="small"
          icon={<CheckCircle />}
          label={`${s.importedChip}: ${summary.created}`}
          color="success"
          variant="outlined"
        />
        <Chip
          size="small"
          icon={<Info />}
          label={`${s.alreadyExistsChip}: ${summary.alreadyExists}`}
          color="warning"
          variant="outlined"
        />
        {summary.errors > 0 && (
          <Chip
            size="small"
            icon={<ErrorOutline />}
            label={`${s.errorChip}: ${summary.errors}`}
            color="error"
            variant="outlined"
          />
        )}
        {summary.pending > 0 && (
          <Chip
            size="small"
            label={`${s.pendingChip}: ${summary.pending}`}
            color="default"
            variant="outlined"
          />
        )}
      </Box>
      <Box sx={{ height: PREVIEW_TABLE_HEIGHT }}>
        <TableVirtuoso
          data={previewRows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => (
            <TableRow style={{ backgroundColor: "white" }}>
              <TableCell>{s.colName}</TableCell>
              <TableCell>{s.colPhone}</TableCell>
              <TableCell>{s.colEmail}</TableCell>
              <TableCell>{s.colAssignee}</TableCell>
              <TableCell align="center">{s.colStatus}</TableCell>
            </TableRow>
          )}
          itemContent={(_index, row) => (
            <ImportCustomerPreviewRowCP
              row={row}
              users={physicalUsers}
              assigneeLoading={Boolean(assigneePatchLoadingByPhone[normalizeImportPhone(row.phone)])}
              onAssigneeChange={(assignedTo) => handleAssigneeChange(row, assignedTo)}
            />
          )}
        />
      </Box>
    </Box>
  )
}
