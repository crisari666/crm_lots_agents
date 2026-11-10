import { Box, Chip, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"

export default function MetaLeadFormsUnregisteredCP() {
  const loading = useAppSelector((state) => state.metaLeadForms.loading)
  const unregisteredForms = useAppSelector((state) => state.metaLeadForms.unregisteredForms)

  if (loading) {
    return null
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {s.unregisteredTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 560 }}>
        {s.unregisteredBody}
      </Typography>
      {unregisteredForms.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {s.unregisteredEmpty}
        </Typography>
      ) : (
        <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
          {unregisteredForms.map((row) => {
            const countLabel =
              row.leadCount === 1 ? `1 ${s.leadCountOne}` : `${row.leadCount} ${s.leadCount}`
            return (
              <Box key={row.formId} sx={{ py: 1.5, px: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {row.formName.length > 0 ? row.formName : row.formId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {row.formId}
                    </Typography>
                  </Box>
                  <Chip size="small" variant="outlined" label={countLabel} />
                </Stack>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
