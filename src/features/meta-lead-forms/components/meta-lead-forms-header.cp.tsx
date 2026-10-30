import Add from "@mui/icons-material/Add"
import { Box, Button, Typography } from "@mui/material"
import { useAppDispatch } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import { openCreatePanelAct } from "../slice/meta-lead-forms.slice"

export default function MetaLeadFormsHeaderCP() {
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
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {s.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          {s.subtitle}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => dispatch(openCreatePanelAct())}
        sx={{ flexShrink: 0 }}
      >
        {s.addForm}
      </Button>
    </Box>
  )
}
