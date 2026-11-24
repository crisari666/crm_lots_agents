import AddOutlined from "@mui/icons-material/AddOutlined"
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined"
import { Box, Button, Skeleton, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { fetchFaqsThunk, openCreateDrawerAct } from "../../slice/lead-assistant-faq.slice"
import SectionEmptyStateCP from "../shared/section-empty-state.cp"
import SectionErrorStateCP from "../shared/section-error-state.cp"
import FaqCoverageGridCP from "./faq-coverage-grid.cp"
import FaqCoverageListCP from "./faq-coverage-list.cp"
import FaqDictionaryCP from "./faq-dictionary.cp"
import FaqEditorDrawerCP from "./faq-editor-drawer.cp"
import UnansweredInboxCP from "./unanswered-inbox.cp"

type TabKey = "dictionary" | "coverage" | "unanswered"

function KnowledgeSkeleton() {
  return (
    <Stack spacing={1} aria-busy="true" aria-label={s.loading}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Skeleton key={index} variant="rounded" height={44} />
      ))}
    </Stack>
  )
}

function KnowledgeBody(props: { readonly tab: TabKey }) {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up("md"))
  const status = useAppSelector((state) => state.leadAssistant.faq.status)
  const error = useAppSelector((state) => state.leadAssistant.faq.error)
  const count = useAppSelector((state) => state.leadAssistant.faq.items.length)
  if (props.tab === "unanswered") {
    return <UnansweredInboxCP />
  }
  if (status === "idle" || status === "loading") {
    return <KnowledgeSkeleton />
  }
  if (status === "failed") {
    return (
      <SectionErrorStateCP
        message={error ?? s.faqLoadError}
        onRetry={() => void dispatch(fetchFaqsThunk())}
      />
    )
  }
  if (count === 0) {
    return (
      <SectionEmptyStateCP
        icon={<MenuBookOutlined fontSize="large" />}
        title={s.faqEmptyTitle}
        body={s.faqEmptyBody}
        actionLabel={s.faqEmptyAction}
        actionIcon={<AddOutlined />}
        onAction={() => dispatch(openCreateDrawerAct())}
      />
    )
  }
  if (props.tab === "dictionary") {
    return <FaqDictionaryCP />
  }
  return isWide ? <FaqCoverageGridCP /> : <FaqCoverageListCP />
}

/** Step 3: FAQ dictionary, coverage matrix and unanswered inbox. */
export default function KnowledgeStepCP() {
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<TabKey>("dictionary")
  const unansweredTotal = useAppSelector((state) => state.leadAssistant.faq.unanswered.total)
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={700}>
            {s.stepTitles.knowledge}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
            {s.knowledgeIntro}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => dispatch(openCreateDrawerAct())}
          sx={{ flexShrink: 0 }}
        >
          {s.faqAdd}
        </Button>
      </Stack>
      <Tabs
        value={tab}
        onChange={(_, next: TabKey) => setTab(next)}
        aria-label={s.knowledgeTabsAria}
        variant="scrollable"
        scrollButtons={false}
      >
        <Tab
          value="dictionary"
          label={s.knowledgeTabDictionary}
          id="knowledge-tab-dictionary"
          aria-controls="knowledge-panel"
        />
        <Tab value="coverage" label={s.knowledgeTabCoverage} id="knowledge-tab-coverage" aria-controls="knowledge-panel" />
        <Tab
          value="unanswered"
          label={s.knowledgeTabUnanswered(unansweredTotal)}
          id="knowledge-tab-unanswered"
          aria-controls="knowledge-panel"
        />
      </Tabs>
      <Box id="knowledge-panel" role="tabpanel" aria-labelledby={`knowledge-tab-${tab}`}>
        <KnowledgeBody tab={tab} />
      </Box>
      <FaqEditorDrawerCP />
    </Stack>
  )
}
