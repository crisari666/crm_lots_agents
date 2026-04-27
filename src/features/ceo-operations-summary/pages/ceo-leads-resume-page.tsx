import CampaignOutlined from "@mui/icons-material/CampaignOutlined"
import { Box, Chip, Stack, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import moment, { type Moment } from "moment"
import { useState } from "react"
import CeoLeadsResumePanelCP from "../components/ceo-leads-resume-panel.cp"

export default function CeoLeadsResumePage() {
  const [from, setFrom] = useState<Moment>(() => moment().subtract(29, "days").startOf("day"))
  const [to, setTo] = useState<Moment>(() => moment().endOf("day"))
  const [includeDetails, setIncludeDetails] = useState<boolean>(false)
  const applyPreset = (preset: "7d" | "30d" | "mtd") => {
    const end = moment().endOf("day")
    if (preset === "7d") {
      setFrom(moment().subtract(6, "days").startOf("day"))
      setTo(end)
      return
    }
    if (preset === "30d") {
      setFrom(moment().subtract(29, "days").startOf("day"))
      setTo(end)
      return
    }
    setFrom(moment().startOf("month"))
    setTo(end)
  }
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CampaignOutlined fontSize="small" />
        <Typography variant="h5" component="h1">
          Leads Resume
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center">
        <Chip size="small" label="7 días" onClick={() => applyPreset("7d")} sx={{ cursor: "pointer" }} />
        <Chip size="small" label="30 días" onClick={() => applyPreset("30d")} sx={{ cursor: "pointer" }} />
        <Chip size="small" label="Mes" onClick={() => applyPreset("mtd")} sx={{ cursor: "pointer" }} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
        <DatePicker
          label="Desde"
          value={from}
          onChange={(value) => value !== null && setFrom(value)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <DatePicker
          label="Hasta"
          value={to}
          onChange={(value) => value !== null && setTo(value)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
      </Stack>
      <Box>
        <CeoLeadsResumePanelCP
          fromIso={from.clone().startOf("day").toISOString()}
          toMonolithIso={to.clone().startOf("day").toISOString()}
          isEnabled
          includeDetails={includeDetails}
          onToggleIncludeDetails={setIncludeDetails}
        />
      </Box>
    </Stack>
  )
}
