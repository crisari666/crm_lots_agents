import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  closePanelAct,
  patchDraftAct,
  saveMetaLeadFormThunk,
} from "../slice/meta-lead-forms.slice"
import type { MetaLeadFormFlowStrategy } from "../types/meta-lead-forms.types"

function FlowCard(props: {
  readonly strategy: MetaLeadFormFlowStrategy
  readonly selected: boolean
  readonly title: string
  readonly body: string
  readonly onSelect: () => void
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={props.onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          props.onSelect()
        }
      }}
      sx={{
        cursor: "pointer",
        p: 2,
        border: 2,
        borderColor: props.selected ? "primary.main" : "divider",
        bgcolor: props.selected ? "action.selected" : "background.paper",
        transition: "border-color 200ms, background-color 200ms",
        "&:hover": { borderColor: "primary.light" },
      }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        {props.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        {props.body}
      </Typography>
    </Box>
  )
}

export default function MetaLeadFormEditorPanelCP() {
  const dispatch = useAppDispatch()
  const panelOpen = useAppSelector((state) => state.metaLeadForms.panelOpen)
  const editingId = useAppSelector((state) => state.metaLeadForms.editingId)
  const draft = useAppSelector((state) => state.metaLeadForms.draft)
  const saving = useAppSelector((state) => state.metaLeadForms.saving)
  const delayMinutes = useAppSelector((state) => state.metaLeadForms.delayDraftMinutes)

  const canSave = draft.formId.trim().length > 0 && draft.formName.trim().length > 0

  return (
    <Drawer
      anchor="right"
      open={panelOpen}
      onClose={() => dispatch(closePanelAct())}
      PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, p: 3 } }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {editingId != null ? s.editForm : s.addForm}
      </Typography>
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField
          label={s.formName}
          value={draft.formName}
          onChange={(event) => dispatch(patchDraftAct({ formName: event.target.value }))}
          fullWidth
          required
        />
        <TextField
          label={s.formId}
          helperText={s.formIdHint}
          value={draft.formId}
          onChange={(event) => dispatch(patchDraftAct({ formId: event.target.value }))}
          fullWidth
          required
          inputProps={{
            style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
          }}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.25 }}>
            {s.flowTitle}
          </Typography>
          <Stack spacing={1.5}>
            <FlowCard
              strategy="immediate_assign"
              selected={draft.flowStrategy === "immediate_assign"}
              title={s.flowImmediateTitle}
              body={s.flowImmediateBody}
              onSelect={() => dispatch(patchDraftAct({ flowStrategy: "immediate_assign" }))}
            />
            <FlowCard
              strategy="lead_conversation"
              selected={draft.flowStrategy === "lead_conversation"}
              title={s.flowQualifyTitle}
              body={s.flowQualifyBody}
              onSelect={() => dispatch(patchDraftAct({ flowStrategy: "lead_conversation" }))}
            />
          </Stack>
          {draft.flowStrategy === "lead_conversation" ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
              {s.settingsBody} ({delayMinutes} {s.settingsMinutes.toLowerCase()})
            </Typography>
          ) : null}
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={draft.enabled}
              onChange={(_, checked) => dispatch(patchDraftAct({ enabled: checked }))}
            />
          }
          label={s.enabled}
        />
        <TextField
          label={s.notes}
          value={draft.notes}
          onChange={(event) => dispatch(patchDraftAct({ notes: event.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button onClick={() => dispatch(closePanelAct())}>{s.cancel}</Button>
          <Button
            variant="contained"
            disabled={!canSave || saving}
            onClick={() => {
              void dispatch(saveMetaLeadFormThunk())
            }}
          >
            {s.save}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  )
}
