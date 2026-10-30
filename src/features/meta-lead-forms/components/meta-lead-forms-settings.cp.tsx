import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  saveMetaLeadFormSettingsThunk,
  setDelayDraftMinutesAct,
} from "../slice/meta-lead-forms.slice"

export default function MetaLeadFormsSettingsCP() {
  const dispatch = useAppDispatch()
  const delayDraftMinutes = useAppSelector((state) => state.metaLeadForms.delayDraftMinutes)
  const saving = useAppSelector((state) => state.metaLeadForms.saving)

  return (
    <Box
      sx={{
        mb: 3,
        py: 2,
        px: 2.5,
        borderLeft: 3,
        borderColor: "primary.main",
        bgcolor: "action.hover",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {s.settingsTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 560 }}>
        {s.settingsBody}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <TextField
          type="number"
          size="small"
          label={s.settingsMinutes}
          value={delayDraftMinutes}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10)
            dispatch(setDelayDraftMinutesAct(Number.isFinite(next) && next >= 1 ? next : 1))
          }}
          inputProps={{ min: 1 }}
          sx={{ width: 120 }}
        />
        <Button
          variant="outlined"
          disabled={saving}
          onClick={() => {
            void dispatch(saveMetaLeadFormSettingsThunk())
          }}
        >
          {s.settingsSave}
        </Button>
      </Stack>
    </Box>
  )
}
