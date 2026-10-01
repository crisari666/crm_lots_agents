import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { useEffect, useState } from "react"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"

const COPIED_FEEDBACK_MS = 1800

type Props = {
  readonly url: string
}

/** Read-only Meet link with copy-to-clipboard feedback. */
export function MeetLinkFieldCp(props: Props) {
  const [isCopied, setIsCopied] = useState(false)
  useEffect(() => {
    if (!isCopied) return
    const timer = window.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
    return () => window.clearTimeout(timer)
  }, [isCopied])
  const copyLink = (): void => {
    void navigator.clipboard.writeText(props.url).then(() => setIsCopied(true))
  }
  return (
    <TextField
      label={s.meetLinkLabel}
      value={props.url}
      fullWidth
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={isCopied ? s.linkCopied : s.copyLink}>
              <IconButton
                aria-label={s.copyLink}
                onClick={copyLink}
                color={isCopied ? "success" : "default"}
              >
                {isCopied ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <ContentCopyIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  )
}
