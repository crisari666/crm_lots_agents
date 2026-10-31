import React from "react"
import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import type { LeadListItem } from "../types/leads.types"
import LeadsSourceChipCP from "./leads-source-chip.cp"

type Props = {
  lead: LeadListItem
  converting: boolean
  onConvert: () => void
}

/**
 * Compact lead audit strip above CustomerDetailDialog tabs when opened from the leads inbox.
 */
export default function LeadsDetailStripCP({
  lead,
  converting,
  onConvert,
}: Props): React.ReactElement {
  return (
    <Box
      sx={{
        mb: 2,
        p: 1.5,
        borderRadius: 1,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {s.leadStripTitle}
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              label={lead.isPromoted ? s.lifecycleCustomer : s.lifecycleLead}
              color={lead.isPromoted ? "success" : "warning"}
            />
            {lead.leadSources.map((source) => (
              <LeadsSourceChipCP key={source} source={source} />
            ))}
          </Stack>
        </Box>
        {!lead.isPromoted ? (
          <Button
            variant="contained"
            size="small"
            disabled={converting}
            onClick={onConvert}
            sx={{ cursor: "pointer", alignSelf: { xs: "stretch", sm: "center" } }}
          >
            {s.convert}
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}
