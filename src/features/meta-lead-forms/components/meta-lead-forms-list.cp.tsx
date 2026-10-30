import DeleteOutline from "@mui/icons-material/DeleteOutline"
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  deleteMetaLeadFormThunk,
  openEditPanelAct,
} from "../slice/meta-lead-forms.slice"
import type { MetaLeadFormItem } from "../types/meta-lead-forms.types"

function FlowChip({ item }: { readonly item: MetaLeadFormItem }) {
  if (!item.enabled) {
    return <Chip size="small" label={s.chipDisabled} variant="outlined" />
  }
  if (item.flowStrategy === "lead_conversation") {
    return <Chip size="small" color="secondary" label={s.chipQualify} />
  }
  return <Chip size="small" color="primary" label={s.chipImmediate} />
}

export default function MetaLeadFormsListCP() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.metaLeadForms.items)
  const loading = useAppSelector((state) => state.metaLeadForms.loading)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box sx={{ py: 6, maxWidth: 480 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {s.emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {s.emptyBody}
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
      {items.map((item) => (
        <Box
          key={item.id}
          onClick={() => dispatch(openEditPanelAct(item))}
          sx={{
            py: 2,
            px: 1,
            cursor: "pointer",
            transition: "background-color 200ms",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {item.formName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {item.formId}
              </Typography>
              {item.notes.length > 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  {item.notes}
                </Typography>
              ) : null}
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <FlowChip item={item} />
              <IconButton
                size="small"
                aria-label={s.delete}
                onClick={(event) => {
                  event.stopPropagation()
                  if (window.confirm(s.deleteConfirm)) {
                    void dispatch(deleteMetaLeadFormThunk(item.id))
                  }
                }}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
