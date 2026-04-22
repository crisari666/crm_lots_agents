import React from "react"
import { Avatar, useTheme } from "@mui/material"
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  PhoneDisabled as PhoneDisabledIcon,
  PhoneMissed as PhoneMissedIcon,
  RingVolume as RingVolumeIcon,
  HourglassEmpty as HourglassEmptyIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material"
import type { CustomerCallLogAdminOutcome } from "../../services/customers-ms.service"

export type CallLogStatusAvatarCPProps = {
  outcome: CustomerCallLogAdminOutcome
}

export default function CallLogStatusAvatarCP({ outcome }: CallLogStatusAvatarCPProps) {
  const theme = useTheme()
  const palette = (() => {
    switch (outcome) {
      case "answered":
        return { bg: theme.palette.success.light, fg: theme.palette.success.dark, Icon: CallIcon }
      case "busy":
        return { bg: theme.palette.warning.light, fg: theme.palette.warning.dark, Icon: PhoneDisabledIcon }
      case "no_answer":
        return { bg: theme.palette.error.light, fg: theme.palette.error.dark, Icon: PhoneMissedIcon }
      case "failed":
      case "canceled":
        return { bg: theme.palette.grey[300], fg: theme.palette.grey[800], Icon: CallEndIcon }
      case "ringing":
        return { bg: theme.palette.info.light, fg: theme.palette.info.dark, Icon: RingVolumeIcon }
      case "in_progress":
        return { bg: theme.palette.primary.light, fg: theme.palette.primary.dark, Icon: HourglassEmptyIcon }
      default:
        return { bg: theme.palette.grey[200], fg: theme.palette.grey[700], Icon: HelpOutlineIcon }
    }
  })()
  const { bg, fg, Icon } = palette
  return (
    <Avatar sx={{ bgcolor: bg, color: fg, width: 40, height: 40 }}>
      <Icon fontSize="small" aria-hidden />
    </Avatar>
  )
}
