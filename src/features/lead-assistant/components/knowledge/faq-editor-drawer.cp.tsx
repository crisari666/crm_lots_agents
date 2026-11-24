import CloseOutlined from "@mui/icons-material/CloseOutlined"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { FAQ_CATEGORY_ORDER } from "../../business-logic/faq-coverage"
import { validateFaqDraft } from "../../business-logic/lead-assistant-validation"
import {
  closeDrawerAct,
  deleteFaqThunk,
  patchDraftAct,
  saveFaqThunk,
  touchFieldAct,
  type FaqAnswerMode,
} from "../../slice/lead-assistant-faq.slice"
import type { LeadFaqCategory } from "../../types/lead-assistant.types"
import ConfirmDialogCP from "../shared/confirm-dialog.cp"
import FaqProjectAnswersCP from "./faq-project-answers.cp"

const DRAWER_WIDTH = 520

/** Right drawer to create/edit a FAQ or answer an unanswered question. */
export default function FaqEditorDrawerCP() {
  const dispatch = useAppDispatch()
  const faq = useAppSelector((state) => state.leadAssistant.faq)
  const [confirm, setConfirm] = useState<"delete" | "discard" | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const baselineRef = useRef<string>("")
  const { draft, touched } = faq
  useEffect(() => {
    if (faq.drawerOpen) {
      baselineRef.current = JSON.stringify(draft)
    }
    // Baseline is captured only when the drawer opens for a given record.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faq.drawerOpen, faq.editingId, faq.convertingQuestionId])
  useEffect(() => {
    if (faq.saveFailedToken > 0) {
      summaryRef.current?.focus()
    }
  }, [faq.saveFailedToken])
  const errors = validateFaqDraft(draft, s.faqValidation)
  const title =
    faq.convertingQuestionId != null
      ? s.faqDrawerConvert
      : faq.editingId != null
        ? s.faqDrawerEdit
        : s.faqDrawerCreate
  const handleClose = () => {
    if (JSON.stringify(draft) !== baselineRef.current) {
      setConfirm("discard")
      return
    }
    dispatch(closeDrawerAct())
  }
  const answerError = touched.answer === true ? errors.answer : undefined
  return (
    <>
      <Drawer
        anchor="right"
        open={faq.drawerOpen}
        onClose={handleClose}
        PaperProps={{ sx: { width: { xs: "100%", sm: DRAWER_WIDTH } } }}
      >
        <Box
          component="form"
          noValidate
          role="dialog"
          aria-labelledby="lead-assistant-faq-drawer-title"
          onSubmit={(event) => {
            event.preventDefault()
            void dispatch(saveFaqThunk())
          }}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
            <Typography id="lead-assistant-faq-drawer-title" variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton aria-label={s.close} onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Stack spacing={2.5} sx={{ px: 3, pb: 2, flex: 1, overflowY: "auto" }}>
            {faq.saveErrorSummary.length > 0 ? (
              <Alert severity="error" role="alert" tabIndex={-1} ref={summaryRef}>
                <AlertTitle>{s.saveSummaryTitle}</AlertTitle>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {faq.saveErrorSummary.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </Box>
              </Alert>
            ) : null}
            <TextField
              id="lead-assistant-faq-question"
              label={s.faqQuestionLabel}
              value={draft.question}
              onChange={(event) => dispatch(patchDraftAct({ question: event.target.value }))}
              onBlur={() => dispatch(touchFieldAct("question"))}
              error={touched.question === true && errors.question != null}
              helperText={touched.question === true ? errors.question : undefined}
              multiline
              minRows={2}
              fullWidth
              required
              autoFocus
            />
            <TextField
              select
              id="lead-assistant-faq-category"
              label={s.faqCategoryLabel}
              value={draft.category}
              onChange={(event) =>
                dispatch(patchDraftAct({ category: event.target.value as LeadFaqCategory }))
              }
              onBlur={() => dispatch(touchFieldAct("category"))}
              error={touched.category === true && errors.category != null}
              helperText={touched.category === true ? errors.category : undefined}
              fullWidth
              required
            >
              {FAQ_CATEGORY_ORDER.map((category) => (
                <MenuItem key={category} value={category}>
                  {s.faqCategories[category]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="lead-assistant-faq-phrasings"
              label={s.faqPhrasingsLabel}
              helperText={s.faqPhrasingsHelper}
              value={draft.phrasingsText}
              onChange={(event) => dispatch(patchDraftAct({ phrasingsText: event.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }} id="lead-assistant-faq-mode-label">
                {s.faqModeLabel}
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={draft.mode}
                aria-labelledby="lead-assistant-faq-mode-label"
                onChange={(_, next: FaqAnswerMode | null) => {
                  if (next != null) {
                    dispatch(patchDraftAct({ mode: next }))
                  }
                }}
              >
                <ToggleButton value="all">{s.faqModeAll}</ToggleButton>
                <ToggleButton value="perProject">{s.faqModePerProject}</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <TextField
              id="lead-assistant-faq-answer"
              label={s.faqGeneralAnswerLabel}
              helperText={answerError ?? s.faqGeneralAnswerHelper}
              error={answerError != null}
              value={draft.defaultAnswer}
              onChange={(event) => dispatch(patchDraftAct({ defaultAnswer: event.target.value }))}
              onBlur={() => dispatch(touchFieldAct("answer"))}
              multiline
              minRows={3}
              fullWidth
            />
            {draft.mode === "perProject" ? <FaqProjectAnswersCP /> : null}
            <FormControlLabel
              control={
                <Switch
                  checked={draft.enabled}
                  onChange={(event) => dispatch(patchDraftAct({ enabled: event.target.checked }))}
                />
              }
              label={s.faqEnabledLabel}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            {faq.editingId != null ? (
              <Button
                color="error"
                startIcon={<DeleteOutline />}
                onClick={() => setConfirm("delete")}
                disabled={faq.saving || faq.deleting}
                sx={{ mr: "auto" }}
              >
                {s.delete}
              </Button>
            ) : (
              <Box sx={{ mr: "auto" }} />
            )}
            <Button onClick={handleClose} disabled={faq.saving}>
              {s.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={faq.saving}
              startIcon={faq.saving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {s.save}
            </Button>
          </Stack>
        </Box>
      </Drawer>
      <ConfirmDialogCP
        open={confirm === "delete"}
        title={s.faqDeleteTitle}
        body={s.faqDeleteBody}
        confirmLabel={s.delete}
        isDestructive
        isLoading={faq.deleting}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          if (faq.editingId != null) {
            void dispatch(deleteFaqThunk(faq.editingId))
          }
        }}
      />
      <ConfirmDialogCP
        open={confirm === "discard"}
        title={s.discardTitle}
        body={s.discardBody}
        confirmLabel={s.discardConfirm}
        isDestructive
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          dispatch(closeDrawerAct())
        }}
      />
    </>
  )
}
