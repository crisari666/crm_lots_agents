import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined"
import { Chip, List, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { buildFaqCoverage } from "../../business-logic/faq-coverage"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import { openEditDrawerAct } from "../../slice/lead-assistant-faq.slice"

/** Below md: one list row per question with "N de M proyectos". */
export default function FaqCoverageListCP() {
  const dispatch = useAppDispatch()
  const faqs = useAppSelector((state) => state.leadAssistant.faq.items)
  const projects = useLeadAssistantProjects()
  const groups = useMemo(() => buildFaqCoverage(faqs, projects), [faqs, projects])
  return (
    <List disablePadding aria-label={s.coverageTableAria}>
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
            {group.rows.map((row) => (
              <ListItemButton
                key={row.faq.id}
                onClick={() => dispatch(openEditDrawerAct(row.faq))}
                divider
              >
                <ListItemText
                  primary={row.faq.question}
                  secondary={s.coverageProjectsCount(row.coveredCount, row.totalProjects)}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  {!row.faq.enabled ? (
                    <Chip size="small" variant="outlined" label={s.faqDisabledChip} />
                  ) : null}
                  <ChevronRightOutlined fontSize="small" aria-hidden />
                </Stack>
              </ListItemButton>
            ))}
          </List>
        </li>
      ))}
    </List>
  )
}
