import RefreshOutlined from "@mui/icons-material/RefreshOutlined"
import { Alert, AlertTitle, Button } from "@mui/material"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"

type Props = {
  readonly message: string
  readonly title?: string
  readonly onRetry?: () => void
}

/** Human-readable load error with a retry action. */
export default function SectionErrorStateCP(props: Props) {
  return (
    <Alert
      severity="error"
      role="alert"
      action={
        props.onRetry != null ? (
          <Button color="inherit" size="small" startIcon={<RefreshOutlined />} onClick={props.onRetry}>
            {s.retry}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{props.title ?? s.loadErrorTitle}</AlertTitle>
      {props.message}
    </Alert>
  )
}
