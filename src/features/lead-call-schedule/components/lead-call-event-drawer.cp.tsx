import React from "react"
import { Alert, Box, Chip, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { formatCallDateTime } from "../business-logic/bogota-time"
import { selectLeadCallAct } from "../slice/lead-call-schedule.slice"
import type { LeadCallItem } from "../types/lead-call-schedule.types"
import LeadCallReassignFormCP from "./lead-call-reassign-form.cp"
import LeadCallStatusActionsCP from "./lead-call-status-actions.cp"

const DRAWER_WIDTH = 420

const STATUS_CHIP_COLOR = {
  pending: "primary",
  done: "success",
  cancelled: "default",
} as const

function DetailRow({ label, value }: { label: string; value?: string }): React.ReactElement | null {
  if (!value) return null
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="dt">
        {label}
      </Typography>
      <Typography variant="body2" component="dd" sx={{ m: 0 }}>
        {value}
      </Typography>
    </Box>
  )
}

const buildScoreLabel = (item: LeadCallItem): string | undefined => {
  if (item.score === undefined) return undefined
  const priority = item.priority !== undefined ? s.priority[item.priority] : undefined
  return [s.scoreValue(item.score, item.maxScore), priority].filter(Boolean).join(" · ")
}

function DrawerBody({ item }: { item: LeadCallItem }): React.ReactElement {
  const actionError = useAppSelector((state) => state.leadCallSchedule.actionError)
  const isPending = item.status === "pending"
  return (
    <Stack spacing={2.5} sx={{ p: 3 }}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Chip size="small" label={s.status[item.status]} color={STATUS_CHIP_COLOR[item.status]} />
          {item.source === "lead_conversation" ? (
            <Chip size="small" variant="outlined" color="secondary" label={s.aiBadgeTooltip} />
          ) : null}
        </Stack>
        <Typography variant="h6" fontWeight={700} sx={{ textTransform: "capitalize" }}>
          {formatCallDateTime(item.scheduledAt)}
        </Typography>
      </Box>
      <Stack component="dl" spacing={1.5} sx={{ m: 0 }}>
        <DetailRow label={s.customer} value={item.customerName} />
        <DetailRow label={s.phone} value={item.phone} />
        <DetailRow label={s.ventor} value={item.ventorName || item.userId} />
        <DetailRow label={s.project} value={item.projectTitle} />
        <DetailRow label={s.score} value={buildScoreLabel(item)} />
        <DetailRow label={s.note} value={item.note} />
      </Stack>
      {actionError ? <Alert severity="error">{actionError}</Alert> : null}
      <Divider />
      {isPending ? (
        <>
          <LeadCallReassignFormCP key={item.eventId} item={item} />
          <LeadCallStatusActionsCP item={item} />
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {s.notActionable}
        </Typography>
      )}
    </Stack>
  )
}

export default function LeadCallEventDrawerCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const selected = useAppSelector((state) =>
    state.leadCallSchedule.items.find((item) => item.eventId === state.leadCallSchedule.selectedEventId)
  )
  const close = () => dispatch(selectLeadCallAct(null))
  return (
    <Drawer anchor="right" open={selected !== undefined} onClose={close} PaperProps={{ sx: { width: { xs: "100%", sm: DRAWER_WIDTH } } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2 }}>
        <Typography variant="overline" fontWeight={700} letterSpacing={1}>
          {s.drawerTitle}
        </Typography>
        <IconButton aria-label={s.close} onClick={close}>
          <Close />
        </IconButton>
      </Stack>
      {selected ? <DrawerBody item={selected} /> : null}
    </Drawer>
  )
}
