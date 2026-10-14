import React, { useState } from "react"
import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { SwapHoriz } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { reassignLeadCallThunk } from "../slice/lead-call-schedule.slice"
import type { LeadCallItem } from "../types/lead-call-schedule.types"

const AUTO_OPTION = "auto"

type Props = {
  item: LeadCallItem
}

export default function LeadCallReassignFormCP({ item }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const ventors = useAppSelector((state) => state.leadCallSchedule.ventors)
  const isActionRunning = useAppSelector((state) => state.leadCallSchedule.isActionRunning)
  const [targetUserId, setTargetUserId] = useState<string>(AUTO_OPTION)
  const candidates = ventors.filter((ventor) => ventor.id !== item.userId)
  const submit = () =>
    void dispatch(
      reassignLeadCallThunk({
        eventId: item.eventId,
        ...(targetUserId === AUTO_OPTION ? {} : { userId: targetUserId }),
      })
    ).then(() => setTargetUserId(AUTO_OPTION))
  return (
    <Stack spacing={1.25}>
      <Typography variant="subtitle2" fontWeight={700}>
        {s.reassignTitle}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {candidates.length === 0 ? s.noVentors : s.reassignHint}
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          size="small"
          label={s.ventorLabel}
          value={targetUserId}
          onChange={(event) => setTargetUserId(event.target.value)}
          disabled={isActionRunning}
          sx={{ flex: 1 }}
        >
          <MenuItem value={AUTO_OPTION}>{s.reassignAuto}</MenuItem>
          {candidates.map((ventor) => (
            <MenuItem key={ventor.id} value={ventor.id}>
              {ventor.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" startIcon={<SwapHoriz />} onClick={submit} disabled={isActionRunning}>
          {s.reassignButton}
        </Button>
      </Stack>
    </Stack>
  )
}
