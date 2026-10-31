import React, { useMemo, useState } from "react"
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { Schedule } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { AGENDA_PERIODS } from "../business-logic/agenda-grid"
import {
  formatMinuteOfDay,
  getBogotaDayKey,
  getBogotaMinuteOfDay,
} from "../business-logic/bogota-time"
import { rescheduleLeadCallThunk } from "../slice/lead-call-schedule.slice"
import type { LeadCallItem } from "../types/lead-call-schedule.types"

const KEEP_VENTOR = "keep"
const MINUTES_PER_HOUR = 60

const pad2 = (value: number): string => String(value).padStart(2, "0")

const minuteOfDayToTimeHm = (minuteOfDay: number): string => {
  const hours = Math.floor(minuteOfDay / MINUTES_PER_HOUR)
  const minutes = minuteOfDay % MINUTES_PER_HOUR
  return `${pad2(hours)}:${pad2(minutes)}`
}

const SLOT_OPTIONS = AGENDA_PERIODS.flatMap((period) =>
  period.slotMinutes.map((minuteOfDay) => ({
    time: minuteOfDayToTimeHm(minuteOfDay),
    label: `${formatMinuteOfDay(minuteOfDay)} · ${s.periods[period.key]}`,
  }))
)

type Props = {
  item: LeadCallItem
}

export default function LeadCallRescheduleFormCP({ item }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const ventors = useAppSelector((state) => state.leadCallSchedule.ventors)
  const isActionRunning = useAppSelector((state) => state.leadCallSchedule.isActionRunning)
  const initialDate = useMemo(() => getBogotaDayKey(new Date(item.scheduledAt)), [item.scheduledAt])
  const initialTime = useMemo(() => {
    const minuteOfDay = getBogotaMinuteOfDay(new Date(item.scheduledAt))
    const snapped = minuteOfDay - (minuteOfDay % 30)
    const time = minuteOfDayToTimeHm(snapped)
    return SLOT_OPTIONS.some((slot) => slot.time === time) ? time : SLOT_OPTIONS[0]?.time ?? "09:00"
  }, [item.scheduledAt])
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState(initialTime)
  const [targetUserId, setTargetUserId] = useState(KEEP_VENTOR)

  const submit = (): void => {
    void dispatch(
      rescheduleLeadCallThunk({
        eventId: item.eventId,
        date,
        time,
        ...(targetUserId === KEEP_VENTOR ? {} : { userId: targetUserId }),
      })
    )
  }

  return (
    <Stack spacing={1.25}>
      <Typography variant="subtitle2" fontWeight={700}>
        {s.rescheduleTitle}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {s.rescheduleHint}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          type="date"
          size="small"
          label={s.rescheduleDateLabel}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={isActionRunning}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          size="small"
          label={s.rescheduleTimeLabel}
          value={time}
          onChange={(event) => setTime(event.target.value)}
          disabled={isActionRunning}
          sx={{ flex: 1 }}
        >
          {SLOT_OPTIONS.map((slot) => (
            <MenuItem key={slot.time} value={slot.time}>
              {slot.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TextField
        select
        size="small"
        label={s.ventorLabel}
        value={targetUserId}
        onChange={(event) => setTargetUserId(event.target.value)}
        disabled={isActionRunning}
        fullWidth
      >
        <MenuItem value={KEEP_VENTOR}>{s.rescheduleKeepVentor}</MenuItem>
        {ventors.map((ventor) => (
          <MenuItem key={ventor.id} value={ventor.id}>
            {ventor.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        startIcon={<Schedule />}
        onClick={submit}
        disabled={isActionRunning || !date || !time}
      >
        {s.rescheduleButton}
      </Button>
    </Stack>
  )
}
