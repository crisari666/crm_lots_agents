import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"
import ErrorOutline from "@mui/icons-material/ErrorOutline"
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import type { LeadReadinessStatus } from "../../types/lead-assistant.types"

type Props = {
  readonly status: LeadReadinessStatus | undefined
}

/** Status glyph; the shape differs per status and carries a text alternative (never color alone). */
export default function StepStatusIconCP(props: Props) {
  if (props.status === "ready") {
    return <CheckCircleOutline fontSize="small" color="success" titleAccess={s.statusReady} />
  }
  if (props.status === "attention") {
    return <ErrorOutline fontSize="small" color="warning" titleAccess={s.statusAttention} />
  }
  return <RadioButtonUnchecked fontSize="small" color="disabled" titleAccess={s.statusMissing} />
}
