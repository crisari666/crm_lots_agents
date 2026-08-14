import { Chip } from "@mui/material"
import type { ProjectLotStatus } from "../types/lot-inventory.types"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

const STATUS_COLOR: Record<
  ProjectLotStatus,
  "success" | "error" | "warning" | "default"
> = {
  available: "success",
  sold: "error",
  hold: "warning",
  locked: "default"
}

const STATUS_LABEL: Record<ProjectLotStatus, string> = {
  available: s.statusAvailable,
  sold: s.statusSold,
  hold: s.statusHold,
  locked: s.statusLocked
}

export function LotStatusChip({
  status,
  size = "small"
}: {
  status: ProjectLotStatus
  size?: "small" | "medium"
}) {
  return (
    <Chip
      size={size}
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      variant={status === "locked" ? "outlined" : "filled"}
      sx={{ cursor: "default" }}
    />
  )
}

export function getStatusLabel(status: ProjectLotStatus): string {
  return STATUS_LABEL[status]
}

export function getBoardTileSx(status: ProjectLotStatus): Record<string, unknown> {
  const palette: Record<ProjectLotStatus, { bg: string; border: string; color: string }> = {
    available: { bg: "#ECFDF5", border: "#10B981", color: "#065F46" },
    hold: { bg: "#FFFBEB", border: "#F59E0B", color: "#92400E" },
    locked: { bg: "#F1F5F9", border: "#64748B", color: "#334155" },
    sold: { bg: "#FFF1F2", border: "#F43F5E", color: "#9F1239" }
  }
  const c = palette[status]
  return {
    bgcolor: c.bg,
    border: `2px solid ${c.border}`,
    color: c.color,
    transition: "background-color 200ms, border-color 200ms, box-shadow 200ms",
    cursor: "pointer",
    "&:hover": {
      boxShadow: 2
    }
  }
}
