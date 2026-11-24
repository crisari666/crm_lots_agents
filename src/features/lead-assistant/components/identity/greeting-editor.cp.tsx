import { Chip, Stack, TextField, Typography, Button } from "@mui/material"
import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  GREETING_VARIABLES,
  insertVariableAtSelection,
  type GreetingVariable,
} from "../../business-logic/interpolate-greeting"
import { validateIdentityDraft } from "../../business-logic/lead-assistant-validation"
import { patchDraftAct, touchFieldAct } from "../../slice/lead-assistant-settings.slice"

const FIELD_ID = "lead-assistant-greeting"

/** Greeting textarea with variable chips that insert `{{variable}}` at the cursor. */
export default function GreetingEditorCP() {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const draft = useAppSelector((state) => state.leadAssistant.settings.draft)
  const isTouched = useAppSelector((state) => state.leadAssistant.settings.touched.greeting === true)
  if (draft == null) {
    return null
  }
  const error = isTouched ? validateIdentityDraft(draft, s.identityValidation).greeting : undefined
  const handleInsert = (variable: GreetingVariable) => {
    const element = inputRef.current
    const result = insertVariableAtSelection(
      draft.greeting,
      variable,
      element?.selectionStart ?? null,
      element?.selectionEnd ?? null,
    )
    dispatch(patchDraftAct({ greeting: result.text }))
    requestAnimationFrame(() => {
      element?.focus()
      element?.setSelectionRange(result.caret, result.caret)
    })
  }
  return (
    <Stack spacing={1}>
      <TextField
        id={FIELD_ID}
        label={s.identityGreetingLabel}
        value={draft.greeting}
        onChange={(event) => dispatch(patchDraftAct({ greeting: event.target.value }))}
        onBlur={() => dispatch(touchFieldAct("greeting"))}
        error={error != null}
        helperText={error ?? s.identityGreetingHelper}
        inputRef={inputRef}
        multiline
        minRows={3}
        fullWidth
        required
      />
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="text.secondary">
          {s.identityInsertVariable}
        </Typography>
        {GREETING_VARIABLES.map((variable) => (
          <Chip
            key={variable}
            size="small"
            variant="outlined"
            label={`{{${variable}}}`}
            clickable
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleInsert(variable)}
            aria-label={s.identityInsertVariableAria(variable)}
          />
        ))}
        <Button
          size="small"
          onClick={() => dispatch(patchDraftAct({ greeting: s.defaultGreeting }))}
        >
          {s.identityRestoreGreeting}
        </Button>
      </Stack>
    </Stack>
  )
}
