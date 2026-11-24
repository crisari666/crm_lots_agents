import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined"
import SearchOutlined from "@mui/icons-material/SearchOutlined"
import {
  Box,
  Chip,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { FAQ_CATEGORY_ORDER, resolveFaqAnswer } from "../../business-logic/faq-coverage"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import { openEditDrawerAct } from "../../slice/lead-assistant-faq.slice"
import type { LeadFaq, LeadFaqCategory } from "../../types/lead-assistant.types"

const ALL_PROJECTS = ""
const ANSWER_CLAMP_LINES = 3
const EXCEPTION_EXCERPT_CHARS = 72

type DictionaryGroup = {
  readonly category: LeadFaqCategory
  readonly faqs: readonly LeadFaq[]
}

function hasText(value: string | undefined): boolean {
  return value != null && value.trim().length > 0
}

function clipExcerpt(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= EXCEPTION_EXCERPT_CHARS) {
    return trimmed
  }
  return `${trimmed.slice(0, EXCEPTION_EXCERPT_CHARS - 1)}…`
}

function matchesSearch(faq: LeadFaq, query: string): boolean {
  if (query.length === 0) {
    return true
  }
  const haystack = [
    faq.question,
    faq.defaultAnswer ?? "",
    ...faq.alternativePhrasings,
    ...faq.projectAnswers.map((entry) => `${entry.projectTitle} ${entry.answer}`),
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(query)
}

function buildGroups(faqs: readonly LeadFaq[], query: string): DictionaryGroup[] {
  const normalized = query.trim().toLowerCase()
  return FAQ_CATEGORY_ORDER.map((category) => ({
    category,
    faqs: faqs.filter((faq) => faq.category === category && matchesSearch(faq, normalized)),
  })).filter((group) => group.faqs.length > 0)
}

function ExceptionChips(props: { readonly faq: LeadFaq }) {
  const exceptions = props.faq.projectAnswers.filter((entry) => hasText(entry.answer))
  if (exceptions.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        {s.dictionaryGeneralOnly}
      </Typography>
    )
  }
  return (
    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
      {exceptions.map((entry) => (
        <Tooltip key={entry.projectId} title={entry.answer}>
          <Chip
            size="small"
            variant="outlined"
            label={s.dictionaryExceptionChip(entry.projectTitle, clipExcerpt(entry.answer))}
          />
        </Tooltip>
      ))}
    </Stack>
  )
}

function DictionaryRow(props: {
  readonly faq: LeadFaq
  readonly projectFilterId: string
}) {
  const dispatch = useAppDispatch()
  const { faq, projectFilterId } = props
  const isFiltered = projectFilterId.length > 0
  const answer = isFiltered
    ? resolveFaqAnswer(faq, projectFilterId)
    : hasText(faq.defaultAnswer)
      ? faq.defaultAnswer!.trim()
      : ""
  const answerLabel = isFiltered ? s.dictionaryAgentAnswerLabel : s.dictionaryGeneralAnswerLabel
  return (
    <ListItemButton
      onClick={() => dispatch(openEditDrawerAct(faq))}
      divider
      alignItems="flex-start"
      sx={{ py: 1.5 }}
    >
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2" component="span" fontWeight={700}>
              {faq.question}
            </Typography>
            {!faq.enabled ? <Chip size="small" variant="outlined" label={s.faqDisabledChip} /> : null}
          </Stack>
        }
        secondary={
          <Box sx={{ mt: 0.75 }}>
            {answer.length > 0 ? (
              <>
                <Typography variant="caption" color="text.secondary" display="block">
                  {answerLabel}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    mt: 0.25,
                    display: "-webkit-box",
                    WebkitLineClamp: ANSWER_CLAMP_LINES,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {answer}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="warning.main">
                {s.dictionaryMissingAnswer}
              </Typography>
            )}
            {!isFiltered ? <ExceptionChips faq={faq} /> : null}
          </Box>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
      <ChevronRightOutlined fontSize="small" aria-hidden sx={{ mt: 0.5, color: "text.secondary" }} />
    </ListItemButton>
  )
}

/** Readable FAQ dictionary: question, general answer, and project exceptions. */
export default function FaqDictionaryCP() {
  const faqs = useAppSelector((state) => state.leadAssistant.faq.items)
  const projects = useLeadAssistantProjects()
  const [search, setSearch] = useState("")
  const [projectFilterId, setProjectFilterId] = useState(ALL_PROJECTS)
  const groups = useMemo(() => buildGroups(faqs, search), [faqs, search])
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          id="lead-assistant-faq-dictionary-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={s.dictionarySearchPlaceholder}
          aria-label={s.dictionarySearchPlaceholder}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="lead-assistant-faq-dictionary-project"
          select
          size="small"
          label={s.dictionaryProjectFilterLabel}
          value={projectFilterId}
          onChange={(event) => setProjectFilterId(event.target.value)}
          sx={{ minWidth: { sm: 220 }, flexShrink: 0 }}
        >
          <MenuItem value={ALL_PROJECTS}>{s.dictionaryProjectFilterAll}</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.title}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {groups.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {s.dictionaryNoMatches}
        </Typography>
      ) : (
        <List disablePadding aria-label={s.dictionaryListAria}>
          {groups.map((group) => (
            <li key={group.category}>
              <List
                disablePadding
                subheader={
                  <ListSubheader component="div" sx={{ bgcolor: "action.hover", lineHeight: "32px" }}>
                    {s.faqCategories[group.category]}
                  </ListSubheader>
                }
              >
                {group.faqs.map((faq) => (
                  <DictionaryRow key={faq.id} faq={faq} projectFilterId={projectFilterId} />
                ))}
              </List>
            </li>
          ))}
        </List>
      )}
    </Stack>
  )
}
