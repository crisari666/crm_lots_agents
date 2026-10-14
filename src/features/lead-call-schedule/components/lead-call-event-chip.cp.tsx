import React from "react"
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useAppDispatch } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { formatCallTime } from "../business-logic/bogota-time"
import { resolveStatusColor } from "../business-logic/status-color"
import { selectLeadCallAct } from "../slice/lead-call-schedule.slice"
import type { LeadCallItem } from "../types/lead-call-schedule.types"

type Props = {
  item: LeadCallItem
  isTimeShown?: boolean
}

export default function LeadCallEventChipCP({ item, isTimeShown = false }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const isCancelled = item.status === "cancelled"
  const isAi = item.source === "lead_conversation"
  return (
    <ButtonBase
      onClick={() => dispatch(selectLeadCallAct(item.eventId))}
      aria-label={`${item.customerName} · ${item.ventorName} · ${s.status[item.status]}`}
      sx={(theme) => ({
        width: "100%",
        display: "flex",
        alignItems: "stretch",
        textAlign: "left",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: alpha(resolveStatusColor(theme, item.status), isCancelled ? 0.04 : 0.08),
        transition: "background-color 150ms ease, transform 150ms ease",
        "&:hover": { bgcolor: alpha(resolveStatusColor(theme, item.status), 0.16) },
        "&:active": { transform: "scale(0.98)" },
        "&.Mui-focusVisible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 1 },
      })}
    >
      <Box sx={(theme) => ({ width: 3, flexShrink: 0, bgcolor: resolveStatusColor(theme, item.status) })} />
      <Box sx={{ px: 0.75, py: 0.5, minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            noWrap
            sx={{ flex: 1, minWidth: 0, textDecoration: isCancelled ? "line-through" : "none" }}
          >
            {isTimeShown ? `${formatCallTime(item.scheduledAt)} · ` : ""}
            {item.customerName || item.phone}
          </Typography>
          {isAi ? (
            <Tooltip title={s.aiBadgeTooltip}>
              <Box
                component="span"
                sx={(theme) => ({
                  px: 0.5,
                  borderRadius: 0.5,
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: "16px",
                  letterSpacing: 0.4,
                  color: theme.palette.secondary.main,
                  bgcolor: alpha(theme.palette.secondary.main, 0.12),
                })}
              >
                {s.aiBadge}
              </Box>
            </Tooltip>
          ) : null}
        </Box>
        <Typography variant="caption" color="text.secondary" noWrap component="div" sx={{ fontSize: 11 }}>
          {item.ventorName || item.userId}
        </Typography>
      </Box>
    </ButtonBase>
  )
}
