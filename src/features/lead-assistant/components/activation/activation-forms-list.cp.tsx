import DynamicFormOutlined from "@mui/icons-material/DynamicFormOutlined"
import {
  Box,
  Chip,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import type { MetaLeadFormFlowStrategy } from "../../../meta-lead-forms/types/meta-lead-forms.types"
import {
  fetchActivationFormsThunk,
  setFormFlowThunk,
} from "../../slice/lead-assistant-settings.slice"
import SectionEmptyStateCP from "../shared/section-empty-state.cp"
import SectionErrorStateCP from "../shared/section-error-state.cp"

const LEGACY_FLOW_AFTER_OFF: MetaLeadFormFlowStrategy = "lead_conversation"

/** Meta lead forms with their current flow and a switch to move them to the V2 assistant. */
export default function ActivationFormsListCP() {
  const dispatch = useAppDispatch()
  const forms = useAppSelector((state) => state.leadAssistant.settings.forms)
  const status = useAppSelector((state) => state.leadAssistant.settings.formsStatus)
  const error = useAppSelector((state) => state.leadAssistant.settings.formsError)
  const savingId = useAppSelector((state) => state.leadAssistant.settings.formSavingId)
  if (status === "idle" || status === "loading") {
    return (
      <Stack spacing={1} aria-busy="true" aria-label={s.loading}>
        {[0, 1].map((index) => (
          <Skeleton key={index} variant="rounded" height={56} />
        ))}
      </Stack>
    )
  }
  if (status === "failed") {
    return (
      <SectionErrorStateCP
        message={error ?? s.formsLoadError}
        onRetry={() => void dispatch(fetchActivationFormsThunk())}
      />
    )
  }
  if (forms.length === 0) {
    return (
      <SectionEmptyStateCP
        icon={<DynamicFormOutlined fontSize="large" />}
        title={s.formsEmptyTitle}
        body={s.formsEmptyBody}
      />
    )
  }
  return (
    <List disablePadding aria-label={s.formsListAria}>
      {forms.map((form) => {
        const isV2 = form.flowStrategy === "lead_conversation_v2"
        const isSaving = savingId === form.id
        return (
          <ListItem key={form.id} divider sx={{ gap: 1.5, px: 0, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant="body1" fontWeight={600}>
                {form.formName}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                <Chip size="small" variant="outlined" label={s.formFlowChips[form.flowStrategy]} />
                {!form.enabled ? (
                  <Chip size="small" variant="outlined" label={s.formDisabledChip} />
                ) : null}
              </Stack>
            </Box>
            <FormControlLabel
              label={s.formUseAssistant}
              control={
                <Switch
                  checked={isV2}
                  disabled={isSaving}
                  onChange={(event) =>
                    void dispatch(
                      setFormFlowThunk({
                        id: form.id,
                        flowStrategy: event.target.checked ? "lead_conversation_v2" : LEGACY_FLOW_AFTER_OFF,
                      }),
                    )
                  }
                  inputProps={{ "aria-label": s.formUseAssistantAria(form.formName) }}
                />
              }
            />
            {isSaving ? <CircularProgress size={16} /> : null}
          </ListItem>
        )
      })}
    </List>
  )
}
