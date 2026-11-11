import Add from "@mui/icons-material/Add"
import { Box, Button, Typography } from "@mui/material"
import { useAppDispatch } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreatePanelAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadFormsToolbarCP() {
  const dispatch = useAppDispatch()
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        mb: 1,
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {s.formsSectionTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          {s.formsSectionSubtitle}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => dispatch(openCreatePanelAct())}
        sx={{ flexShrink: 0, cursor: "pointer" }}
      >
        {s.addForm}
      </Button>
    </Box>
  )
}
