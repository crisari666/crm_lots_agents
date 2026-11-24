import CheckOutlined from "@mui/icons-material/CheckOutlined"
import CloseOutlined from "@mui/icons-material/CloseOutlined"
import ForumOutlined from "@mui/icons-material/ForumOutlined"
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  dismissUnansweredThunk,
  fetchUnansweredThunk,
  openFromQuestionAct,
} from "../../slice/lead-assistant-faq.slice"
import SectionEmptyStateCP from "../shared/section-empty-state.cp"
import SectionErrorStateCP from "../shared/section-error-state.cp"

function formatAskedAt(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
}

/** Questions the assistant could not answer: convert them into FAQs or dismiss them. */
export default function UnansweredInboxCP() {
  const dispatch = useAppDispatch()
  const unanswered = useAppSelector((state) => state.leadAssistant.faq.unanswered)
  const status = useAppSelector((state) => state.leadAssistant.faq.unansweredStatus)
  const error = useAppSelector((state) => state.leadAssistant.faq.unansweredError)
  const busyId = useAppSelector((state) => state.leadAssistant.faq.unansweredBusyId)
  const isPageEmptyWithMore =
    status === "ready" && unanswered.items.length === 0 && unanswered.total > 0
  useEffect(() => {
    if (isPageEmptyWithMore) {
      void dispatch(fetchUnansweredThunk(Math.max(0, unanswered.page - 1)))
    }
  }, [dispatch, isPageEmptyWithMore, unanswered.page])
  if (status === "idle" || status === "loading" || isPageEmptyWithMore) {
    return (
      <Stack spacing={1} aria-busy="true" aria-label={s.loading}>
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} variant="rounded" height={64} />
        ))}
      </Stack>
    )
  }
  if (status === "failed") {
    return (
      <SectionErrorStateCP
        message={error ?? s.unansweredLoadError}
        onRetry={() => void dispatch(fetchUnansweredThunk(unanswered.page))}
      />
    )
  }
  if (unanswered.items.length === 0 && unanswered.total === 0) {
    return (
      <SectionEmptyStateCP
        icon={<ForumOutlined fontSize="large" />}
        title={s.unansweredEmptyTitle}
        body={s.unansweredEmptyBody}
      />
    )
  }
  const pageCount = Math.max(1, Math.ceil(unanswered.total / unanswered.limit))
  return (
    <Stack spacing={2}>
      <List disablePadding>
        {unanswered.items.map((item) => (
          <ListItem
            key={item.id}
            divider
            sx={{ alignItems: "flex-start", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1">{item.question}</Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
                <Typography variant="caption" color="text.secondary">
                  {formatAskedAt(item.askedAt)}
                </Typography>
                {item.projectTitle != null ? (
                  <Chip size="small" variant="outlined" label={item.projectTitle} />
                ) : null}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                startIcon={<CheckOutlined />}
                disabled={busyId === item.id}
                onClick={() => dispatch(openFromQuestionAct({ question: item.question, questionId: item.id }))}
              >
                {s.unansweredConvert}
              </Button>
              <Button
                size="small"
                color="inherit"
                startIcon={<CloseOutlined />}
                disabled={busyId === item.id}
                onClick={() => void dispatch(dismissUnansweredThunk(item.id))}
              >
                {s.unansweredDismiss}
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
      {pageCount > 1 ? (
        <Pagination
          count={pageCount}
          page={unanswered.page + 1}
          onChange={(_, next) => void dispatch(fetchUnansweredThunk(next - 1))}
          aria-label={s.unansweredPaginationAria}
        />
      ) : null}
    </Stack>
  )
}
