import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import Link from "@mui/material/Link"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useCallback, useMemo, useState } from "react"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import {
  buildProjectStockPublicUrl,
  type ProjectStockPublicView
} from "../utils/project-stock-public-url.util"

type ProjectStockPublicLinkCPProps = {
  readonly projectId: string
}

const VIEW_OPTIONS: Array<{ value: "" | ProjectStockPublicView; label: string }> = [
  { value: "", label: s.listPublicStockViewDefault },
  { value: "map", label: s.listPublicStockViewMap },
  { value: "grid", label: s.listPublicStockViewGrid },
  { value: "columns", label: s.listPublicStockViewColumns }
]

export default function ProjectStockPublicLinkCP({
  projectId
}: ProjectStockPublicLinkCPProps) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<"" | ProjectStockPublicView>("")
  const link = useMemo(
    () => buildProjectStockPublicUrl(projectId, view || undefined),
    [projectId, view]
  )
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
  if (getAgentBaseMissing(link, projectId)) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.listMissingAgentBaseUrl}
      </Typography>
    )
  }
  return (
    <Stack spacing={0.75} sx={{ maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
      <FormControl size="small" fullWidth>
        <InputLabel id={`stock-view-${projectId}`}>
          {s.listPublicStockViewLabel}
        </InputLabel>
        <Select
          labelId={`stock-view-${projectId}`}
          label={s.listPublicStockViewLabel}
          value={view}
          onChange={(e) =>
            setView(e.target.value as "" | ProjectStockPublicView)
          }
        >
          {VIEW_OPTIONS.map((opt) => (
            <MenuItem key={opt.value || "default"} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title={link}>
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
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
            onClick={() => {
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
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

function getAgentBaseMissing(link: string, projectId: string): boolean {
  return link === "" && projectId.trim() !== ""
}
