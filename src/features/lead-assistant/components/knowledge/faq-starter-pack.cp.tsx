import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { FAQ_CATEGORY_ORDER } from "../../business-logic/faq-coverage"
import {
  closeStarterAct,
  patchStarterDraftAct,
  saveStarterPackThunk,
} from "../../slice/lead-assistant-faq.slice"

/** Suggested questions as drafts: write the answer and save the ones you want. */
export default function FaqStarterPackCP() {
  const dispatch = useAppDispatch()
  const drafts = useAppSelector((state) => state.leadAssistant.faq.starterDrafts)
  const isSaving = useAppSelector((state) => state.leadAssistant.faq.starterSaving)
  const answeredCount = drafts.filter((draft) => draft.answer.trim().length > 0).length
  const groups = useMemo(
    () =>
      FAQ_CATEGORY_ORDER.map((category) => ({
        category,
        rows: drafts.filter((draft) => draft.category === category),
      })).filter((group) => group.rows.length > 0),
    [drafts],
  )
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6" component="h3">
          {s.starterTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
          {s.starterBody}
        </Typography>
      </Box>
      {groups.map((group) => (
        <Stack key={group.category} spacing={1.5} component="section" aria-label={s.faqCategories[group.category]}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
            {s.faqCategories[group.category]}
          </Typography>
          {group.rows.map((draft) => (
            <TextField
              key={draft.key}
              id={`lead-assistant-starter-${draft.key}`}
              label={draft.question}
              placeholder={s.starterAnswerPlaceholder}
              value={draft.answer}
              onChange={(event) =>
                dispatch(patchStarterDraftAct({ key: draft.key, answer: event.target.value }))
              }
              multiline
              minRows={2}
              fullWidth
            />
          ))}
        </Stack>
      ))}
      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
        <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
          {s.starterSkipHint}
        </Typography>
        <Button onClick={() => dispatch(closeStarterAct())} disabled={isSaving}>
          {s.cancel}
        </Button>
        <Button
          variant="contained"
          disabled={answeredCount === 0 || isSaving}
          onClick={() => void dispatch(saveStarterPackThunk())}
        >
          {s.starterSave(answeredCount)}
        </Button>
      </Stack>
    </Stack>
  )
}
