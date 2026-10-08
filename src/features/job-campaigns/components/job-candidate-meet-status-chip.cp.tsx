import { Chip, Tooltip, type ChipProps } from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type {
  JobCampaignCandidateMeetMessage,
  JobCampaignCandidateMeetStatus,
} from "../types/job-campaign.types"

type Props = {
  readonly meetMessage: JobCampaignCandidateMeetMessage | null
}

type ChipLook = {
  readonly label: string
  readonly color: ChipProps["color"]
  readonly variant: ChipProps["variant"]
}

const MEET_STATUS_LOOK: Readonly<Record<JobCampaignCandidateMeetStatus, ChipLook>> = {
  queued: { label: s.meetStatusQueued, color: "default", variant: "outlined" },
  sending: { label: s.meetStatusSending, color: "default", variant: "outlined" },
  sent: { label: s.meetStatusSent, color: "info", variant: "outlined" },
  delivered: { label: s.meetStatusDelivered, color: "success", variant: "outlined" },
  read: { label: s.meetStatusRead, color: "success", variant: "filled" },
  failed: { label: s.meetStatusFailed, color: "error", variant: "outlined" },
  spam: { label: s.meetStatusSpam, color: "warning", variant: "filled" },
}

const buildTooltip = (message: JobCampaignCandidateMeetMessage): string => {
  const updatedAt = `${s.meetStatusUpdatedAt}: ${new Date(message.updatedAt).toLocaleString()}`
  const reason =
    message.status === "spam" ? message.errorMessage || s.meetStatusSpamHint : message.errorMessage
  return [`${s.meetStatusLabel} · ${updatedAt}`, reason].filter((part) => part.length > 0).join("\n")
}

/** Delivery state of the group Meet WhatsApp template for one candidate. */
export function JobCandidateMeetStatusChipCp(props: Props) {
  if (props.meetMessage == null) return null
  const look = MEET_STATUS_LOOK[props.meetMessage.status]
  return (
    <Tooltip title={<span style={{ whiteSpace: "pre-line" }}>{buildTooltip(props.meetMessage)}</span>}>
      <Chip
        size="small"
        label={look.label}
        color={look.color}
        variant={look.variant}
        aria-label={`${s.meetStatusLabel}: ${look.label}`}
      />
    </Tooltip>
  )
}
