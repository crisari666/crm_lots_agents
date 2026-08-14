import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useCallback, useState } from "react"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import { buildProjectStockPublicUrl } from "../utils/project-stock-public-url.util"

type ProjectStockPublicLinkCPProps = {
  readonly projectId: string
}

export default function ProjectStockPublicLinkCP({
  projectId
}: ProjectStockPublicLinkCPProps) {
  const [copied, setCopied] = useState(false)
  const link = buildProjectStockPublicUrl(projectId)
  const handleCopy = useCallback(async () => {
    if (link === "") return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [link])
  if (link === "") {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.listMissingAgentBaseUrl}
      </Typography>
    )
  }
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ maxWidth: 280 }}>
      <Tooltip title={link}>
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          onClick={(e) => e.stopPropagation()}
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "monospace"
          }}
        >
          {link}
        </Link>
      </Tooltip>
      <Tooltip title={copied ? s.listCopiedPublicStock : s.listCopyPublicStock}>
        <IconButton
          size="small"
          color="primary"
          aria-label={s.listCopyPublicStock}
          onClick={(e) => {
            e.stopPropagation()
            void handleCopy()
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={s.listOpenPublicStock}>
        <IconButton
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          color="primary"
          aria-label={s.listOpenPublicStock}
          onClick={(e) => e.stopPropagation()}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
