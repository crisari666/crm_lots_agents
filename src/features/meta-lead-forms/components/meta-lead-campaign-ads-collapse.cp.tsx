import ExpandMore from "@mui/icons-material/ExpandMore"
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import type { MetaLeadAdCampaignNestedAd } from "../types/meta-lead-forms.types"

type MetaLeadCampaignAdsCollapseProps = {
  readonly ads: readonly MetaLeadAdCampaignNestedAd[]
  readonly expanded: boolean
  readonly onToggle: () => void
  readonly showLeadCounts?: boolean
}

export default function MetaLeadCampaignAdsCollapseCP({
  ads,
  expanded,
  onToggle,
  showLeadCounts = true,
}: MetaLeadCampaignAdsCollapseProps) {
  if (ads.length === 0) {
    return null
  }

  const countLabel =
    ads.length === 1 ? `1 ${s.adsCountOne}` : `${ads.length} ${s.adsCount}`

  return (
    <Box sx={{ mt: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        sx={{
          cursor: "pointer",
          width: "fit-content",
          borderRadius: 1,
          px: 0.25,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <IconButton
          size="small"
          aria-expanded={expanded}
          aria-label={expanded ? s.adsCollapse : s.adsExpand}
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          sx={{
            p: 0.25,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        >
          <ExpandMore fontSize="small" />
        </IconButton>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {s.adsUnderCampaign} · {countLabel}
        </Typography>
      </Stack>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack spacing={0.5} sx={{ mt: 1, pl: 1.5, borderLeft: 2, borderColor: "divider" }}>
          {ads.map((ad) => (
            <Box key={ad.adId}>
              <Typography variant="body2" noWrap>
                {ad.adName.length > 0 ? ad.adName : ad.adId}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {ad.adId}
                {showLeadCounts && ad.leadCount > 0
                  ? ` · ${ad.leadCount === 1 ? `1 ${s.leadCountOne}` : `${ad.leadCount} ${s.leadCount}`}`
                  : ""}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Collapse>
    </Box>
  )
}
