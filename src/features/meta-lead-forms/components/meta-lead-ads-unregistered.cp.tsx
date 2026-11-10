import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreateAdPanelAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadAdsUnregisteredCP() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.metaLeadForms.loading)
  const unregisteredAds = useAppSelector((state) => state.metaLeadForms.unregisteredAds)

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
      {unregisteredAds.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {s.adsUnregisteredEmpty}
        </Typography>
      ) : (
        <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
          {unregisteredAds.map((row) => {
            const countLabel =
              row.leadCount === 1 ? `1 ${s.leadCountOne}` : `${row.leadCount} ${s.leadCount}`
            return (
              <Box key={row.adId} sx={{ py: 1.5, px: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {row.adName.length > 0 ? row.adName : row.adId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {row.adId}
                    </Typography>
                    {row.campaignName != null && row.campaignName.length > 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        {row.campaignName}
                      </Typography>
                    ) : null}
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" variant="outlined" label={countLabel} />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        dispatch(
                          openCreateAdPanelAct({
                            adId: row.adId,
                            adName: row.adName,
                            campaignId: row.campaignId ?? "",
                            campaignName: row.campaignName ?? "",
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
