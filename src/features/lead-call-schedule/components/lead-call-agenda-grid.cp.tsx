import React, { Fragment, useMemo } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import {
  AGENDA_PERIODS,
  OTHER_SLOT_MINUTE,
  buildCellKey,
  groupCallsByCell,
  type AgendaPeriodKey,
} from "../business-logic/agenda-grid"
import {
  buildWeekDayKeys,
  formatDayMonth,
  formatMinuteOfDay,
  formatWeekdayShort,
  getBogotaDayKey,
} from "../business-logic/bogota-time"
import type { LeadCallItem } from "../types/lead-call-schedule.types"
import LeadCallEventChipCP from "./lead-call-event-chip.cp"

const TIME_COLUMN_WIDTH = 76
const GRID_COLUMNS = `${TIME_COLUMN_WIDTH}px repeat(7, minmax(128px, 1fr))`

type CellProps = {
  calls: LeadCallItem[]
  isToday: boolean
  isTimeShown?: boolean
}

function AgendaCell({ calls, isToday, isTimeShown = false }: CellProps): React.ReactElement {
  return (
    <Box
      sx={(theme) => ({
        minHeight: 44,
        p: 0.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: isToday ? alpha(theme.palette.primary.main, 0.03) : "transparent",
      })}
    >
      <Stack spacing={0.5}>
        {calls.map((call) => (
          <LeadCallEventChipCP key={call.eventId} item={call} isTimeShown={isTimeShown} />
        ))}
      </Stack>
    </Box>
  )
}

function PeriodHeader({ periodKey }: { periodKey: AgendaPeriodKey }): React.ReactElement {
  return (
    <Box
      sx={(theme) => ({
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "baseline",
        gap: 1,
        px: 1,
        pt: 2,
        pb: 0.75,
        position: "sticky",
        left: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Typography variant="overline" fontWeight={700} lineHeight={1.4} letterSpacing={1}>
        {s.periods[periodKey]}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {s.periodRange[periodKey]}
      </Typography>
    </Box>
  )
}

/** Week x 30-minute slot grid, grouped by the bot's call windows (desktop). */
export default function LeadCallAgendaGridCP(): React.ReactElement {
  const items = useAppSelector((state) => state.leadCallSchedule.items)
  const weekStart = useAppSelector((state) => state.leadCallSchedule.filters.weekStart)
  const dayKeys = useMemo(() => buildWeekDayKeys(weekStart), [weekStart])
  const cells = useMemo(() => groupCallsByCell(items), [items])
  const todayKey = getBogotaDayKey(new Date())
  const hasOtherCalls = dayKeys.some((dayKey) => cells.has(buildCellKey(dayKey, OTHER_SLOT_MINUTE)))
  return (
    <Box sx={{ overflowX: "auto", border: 1, borderColor: "divider", borderRadius: 1.5, bgcolor: "background.paper" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, minWidth: TIME_COLUMN_WIDTH + 7 * 128 }}>
        <Box />
        {dayKeys.map((dayKey) => {
          const isToday = dayKey === todayKey
          return (
            <Box key={dayKey} sx={{ px: 1, py: 1.25, borderLeft: 1, borderColor: "divider" }}>
              <Typography
                variant="caption"
                color={isToday ? "primary" : "text.secondary"}
                fontWeight={600}
                sx={{ textTransform: "capitalize", display: "block" }}
              >
                {formatWeekdayShort(dayKey)}
              </Typography>
              <Typography variant="subtitle2" fontWeight={isToday ? 700 : 500} color={isToday ? "primary" : "text.primary"}>
                {formatDayMonth(dayKey)}
              </Typography>
            </Box>
          )
        })}
        {AGENDA_PERIODS.map((period) => (
          <Fragment key={period.key}>
            <PeriodHeader periodKey={period.key} />
            {period.slotMinutes.map((slotMinute) => (
              <Fragment key={slotMinute}>
                <Box
                  sx={{
                    px: 1,
                    pt: 0.75,
                    borderTop: 1,
                    borderColor: "divider",
                    color: "text.secondary",
                    fontSize: 12,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatMinuteOfDay(slotMinute)}
                </Box>
                {dayKeys.map((dayKey) => (
                  <AgendaCell
                    key={dayKey}
                    calls={cells.get(buildCellKey(dayKey, slotMinute)) ?? []}
                    isToday={dayKey === todayKey}
                  />
                ))}
              </Fragment>
            ))}
          </Fragment>
        ))}
        {hasOtherCalls ? (
          <>
            <PeriodHeader periodKey="other" />
            <Box sx={{ borderTop: 1, borderColor: "divider" }} />
            {dayKeys.map((dayKey) => (
              <AgendaCell
                key={dayKey}
                calls={cells.get(buildCellKey(dayKey, OTHER_SLOT_MINUTE)) ?? []}
                isToday={dayKey === todayKey}
                isTimeShown
              />
            ))}
          </>
        ) : null}
      </Box>
    </Box>
  )
}
