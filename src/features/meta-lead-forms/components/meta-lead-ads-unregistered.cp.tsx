import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreateAdPanelAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadAdsUnregisteredCP() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.metaLeadForms.loading)
  const unregisteredCampaigns = useAppSelector(
    (state) => state.metaLeadForms.unregisteredCampaigns,
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
                    {row.ads.length > 0 ? (
                      <Stack
                        spacing={0.5}
                        sx={{ mt: 1, pl: 1.5, borderLeft: 2, borderColor: "divider" }}
                      >
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {s.adsUnderCampaign}
                        </Typography>
                        {row.ads.map((ad) => (
                          <Box key={ad.adId}>
                            <Typography variant="body2" noWrap>
                              {ad.adName.length > 0 ? ad.adName : ad.adId}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                              }}
                            >
                              {ad.adId}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : null}
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
