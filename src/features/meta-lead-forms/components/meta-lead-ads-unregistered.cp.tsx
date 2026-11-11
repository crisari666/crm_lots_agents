import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreateAdPanelAct } from "../slice/meta-lead-forms.slice"
import MetaLeadCampaignAdsCollapseCP from "./meta-lead-campaign-ads-collapse.cp"

export default function MetaLeadAdsUnregisteredCP() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.metaLeadForms.loading)
  const unregisteredCampaigns = useAppSelector(
    (state) => state.metaLeadForms.unregisteredCampaigns,
  )
  const [expandedByCampaignId, setExpandedByCampaignId] = useState<Record<string, boolean>>(
    {},
  )

  if (loading) {
    return null
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {s.adsUnregisteredTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 560 }}>
        {s.adsUnregisteredBody}
      </Typography>
      {unregisteredCampaigns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {s.adsUnregisteredEmpty}
        </Typography>
      ) : (
        <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
          {unregisteredCampaigns.map((row) => {
            const countLabel =
              row.leadCount === 1 ? `1 ${s.leadCountOne}` : `${row.leadCount} ${s.leadCount}`
            const adsLabel =
              row.ads.length === 1
                ? `1 ${s.adsCountOne}`
                : `${row.ads.length} ${s.adsCount}`
            const firstAd = row.ads[0]
            const expanded = expandedByCampaignId[row.campaignId] === true
            return (
              <Box key={row.campaignId} sx={{ py: 1.5, px: 1 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {row.campaignName.length > 0 ? row.campaignName : row.campaignId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {row.campaignId}
                    </Typography>
                    <MetaLeadCampaignAdsCollapseCP
                      ads={row.ads}
                      expanded={expanded}
                      showLeadCounts={false}
                      onToggle={() =>
                        setExpandedByCampaignId((prev) => ({
                          ...prev,
                          [row.campaignId]: !prev[row.campaignId],
                        }))
                      }
                    />
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                    {row.ads.length > 0 ? (
                      <Chip size="small" variant="outlined" label={adsLabel} />
                    ) : null}
                    <Chip size="small" variant="outlined" label={countLabel} />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        dispatch(
                          openCreateAdPanelAct({
                            campaignId: row.campaignId,
                            campaignName: row.campaignName,
                            adId: firstAd?.adId ?? "",
                            adName: firstAd?.adName ?? "",
                            previewAds: row.ads,
                          }),
                        )
                      }
                    >
                      {s.adsRegisterFromList}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
