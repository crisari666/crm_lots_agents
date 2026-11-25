import React, { useState } from "react"
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material"
import { ViewColumn as ViewColumnIcon } from "@mui/icons-material"
import type { TableColumnVisibility } from "../hooks/use-table-column-visibility"

export type TableColumnPickerOption = {
  readonly id: string
  readonly label: string
  readonly locked?: boolean
}

export type TableColumnPickerCPProps = {
  readonly columns: readonly TableColumnPickerOption[]
  readonly visibility: TableColumnVisibility
  readonly onChange: (columnId: string, visible: boolean) => void
  readonly menuLabel?: string
}

/**
 * ViewColumn icon button with checkbox menu for table column visibility.
 */
export default function TableColumnPickerCP({
  columns,
  visibility,
  onChange,
  menuLabel = "Columnas",
}: TableColumnPickerCPProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = anchorEl !== null
  return (
    <>
      <Tooltip title={menuLabel}>
        <IconButton
          size="small"
          aria-label={menuLabel}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ cursor: "pointer" }}
        >
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled sx={{ opacity: 1, cursor: "default" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {menuLabel}
          </Typography>
        </MenuItem>
        {columns.map((column) => {
          const checked = visibility[column.id] !== false
          const locked = column.locked === true
          return (
            <MenuItem
              key={column.id}
              dense
              disabled={locked}
              onClick={(event) => {
                event.preventDefault()
                if (!locked) {
                  onChange(column.id, !checked)
                }
              }}
              sx={{ cursor: locked ? "default" : "pointer" }}
            >
              <FormControlLabel
                control={<Checkbox size="small" checked={checked} disabled={locked} />}
                label={column.label}
                sx={{ pointerEvents: "none", m: 0 }}
              />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
