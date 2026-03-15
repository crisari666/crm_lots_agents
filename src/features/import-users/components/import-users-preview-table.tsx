import React from "react"
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
  Typography
} from "@mui/material"
import CheckCircle from "@mui/icons-material/CheckCircle"
import Info from "@mui/icons-material/Info"
import { TableComponents, TableVirtuoso } from "react-virtuoso"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import type { ImportUserRowPreview } from "../import-users.state"

const VirtuosoTableComponents: TableComponents<ImportUserRowPreview> = {
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
  ))
}

function RowStatus({ row }: { row: ImportUserRowPreview }) {
  if (row.status === "created") {
    return (
      <Chip
        size="small"
        icon={<CheckCircle />}
        label="Importado"
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
        label="Ya existe"
        color="warning"
        variant="outlined"
      />
    )
  }
  return <Typography variant="body2" color="text.secondary">—</Typography>
}

const PREVIEW_TABLE_HEIGHT = 400

export default function ImportUsersPreviewTable() {
  const { previewRows } = useAppSelector((state: RootState) => state.importUsers)

  if (previewRows.length === 0) return null

  return (
    <Box sx={{ height: PREVIEW_TABLE_HEIGHT, mt: 2 }}>
      <TableVirtuoso
        data={previewRows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => (
          <TableRow style={{ backgroundColor: "white" }}>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Estado</TableCell>
          </TableRow>
        )}
        itemContent={(index, row) => (
          <>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.lastName}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell align="center">
              <RowStatus row={row} />
            </TableCell>
          </>
        )}
      />
    </Box>
  )
}
