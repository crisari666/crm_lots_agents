import React, { useMemo } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { groupCallsByDay } from "../business-logic/agenda-grid"
import { buildWeekDayKeys, formatLongDay, getBogotaDayKey } from "../business-logic/bogota-time"
import LeadCallEventChipCP from "./lead-call-event-chip.cp"

/** Mobile agenda: one stacked list per day, with time on each call. */
export default function LeadCallDayListCP(): React.ReactElement {
  const items = useAppSelector((state) => state.leadCallSchedule.items)
  const weekStart = useAppSelector((state) => state.leadCallSchedule.filters.weekStart)
  const dayKeys = useMemo(() => buildWeekDayKeys(weekStart), [weekStart])
  const days = useMemo(() => groupCallsByDay(items), [items])
  const todayKey = getBogotaDayKey(new Date())
  return (
    <Stack spacing={2.5}>
      {dayKeys.map((dayKey) => {
        const calls = days.get(dayKey) ?? []
        const isToday = dayKey === todayKey
        return (
          <Box key={dayKey} component="section" aria-label={formatLongDay(dayKey)}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={isToday ? "primary" : "text.primary"}
              sx={{ textTransform: "capitalize", mb: 0.75 }}
            >
              {formatLongDay(dayKey)}
            </Typography>
            {calls.length === 0 ? (
              <Typography variant="caption" color="text.disabled">
                {s.emptyDay}
              </Typography>
            ) : (
              <Stack spacing={0.75}>
                {calls.map((call) => (
                  <LeadCallEventChipCP key={call.eventId} item={call} isTimeShown />
                ))}
              </Stack>
            )}
          </Box>
        )
      })}
    </Stack>
  )
}
