import Add from "@mui/icons-material/Add"
import { Box, Button, Typography } from "@mui/material"
import { useAppDispatch } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreateAdPanelAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadAdsHeaderCP() {
  const dispatch = useAppDispatch()
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        mt: 6,
        mb: 1,
        pt: 4,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {s.adsSectionTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          {s.adsSectionSubtitle}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => dispatch(openCreateAdPanelAct())}
        sx={{ flexShrink: 0 }}
      >
        {s.addAd}
      </Button>
    </Box>
  )
}
