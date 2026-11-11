import DeleteOutline from "@mui/icons-material/DeleteOutline"
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  deleteMetaLeadAdCampaignThunk,
  openEditAdPanelAct,
} from "../slice/meta-lead-forms.slice"
import MetaLeadCampaignAdsCollapseCP from "./meta-lead-campaign-ads-collapse.cp"

function LeadCountChip({ count }: { readonly count: number }) {
  const label = count === 1 ? `1 ${s.leadCountOne}` : `${count} ${s.leadCount}`
  return <Chip size="small" variant="outlined" label={label} />
}

function AdsCountChip({ count }: { readonly count: number }) {
  const label = count === 1 ? `1 ${s.adsCountOne}` : `${count} ${s.adsCount}`
  return <Chip size="small" variant="outlined" label={label} />
}

export default function MetaLeadAdsListCP() {
  const dispatch = useAppDispatch()
  const adItems = useAppSelector((state) => state.metaLeadForms.adItems)
  const leadCountByCampaignId = useAppSelector(
    (state) => state.metaLeadForms.leadCountByCampaignId,
  )
  const adsByCampaignId = useAppSelector((state) => state.metaLeadForms.adsByCampaignId)
  const loading = useAppSelector((state) => state.metaLeadForms.loading)
  const [expandedByCampaignId, setExpandedByCampaignId] = useState<Record<string, boolean>>(
    {},
  )

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (adItems.length === 0) {
    return (
      <Box sx={{ py: 4, maxWidth: 480 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {s.adsEmptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {s.adsEmptyBody}
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
      {adItems.map((item) => {
        const leadCount = leadCountByCampaignId[item.campaignId] ?? 0
        const nestedAds = adsByCampaignId[item.campaignId] ?? []
        const expanded = expandedByCampaignId[item.campaignId] === true
        return (
          <Box
            key={item.id}
            onClick={() => dispatch(openEditAdPanelAct(item))}
            sx={{
              py: 2,
              px: 1,
              cursor: "pointer",
              transition: "background-color 200ms",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {item.campaignName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {item.campaignId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.projectTitle.length > 0 ? item.projectTitle : item.projectId}
                </Typography>
                {!item.enabled ? (
                  <Chip size="small" label={s.chipDisabled} variant="outlined" sx={{ mt: 0.75 }} />
                ) : null}
                <MetaLeadCampaignAdsCollapseCP
                  ads={nestedAds}
                  expanded={expanded}
                  onToggle={() =>
                    setExpandedByCampaignId((prev) => ({
                      ...prev,
                      [item.campaignId]: !prev[item.campaignId],
                    }))
                  }
                />
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {nestedAds.length > 0 ? <AdsCountChip count={nestedAds.length} /> : null}
                <LeadCountChip count={leadCount} />
                <IconButton
                  size="small"
                  aria-label={s.delete}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (window.confirm(s.adsDeleteConfirm)) {
                      void dispatch(deleteMetaLeadAdCampaignThunk(item.id))
                    }
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}
