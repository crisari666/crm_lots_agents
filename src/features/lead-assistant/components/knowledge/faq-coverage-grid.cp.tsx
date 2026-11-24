import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"
import ErrorOutline from "@mui/icons-material/ErrorOutline"
import PublicOutlined from "@mui/icons-material/PublicOutlined"
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import { Fragment, useMemo, type ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { buildFaqCoverage, type CoverageCellState } from "../../business-logic/faq-coverage"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import { openEditDrawerAct } from "../../slice/lead-assistant-faq.slice"

const CELL_ICONS: Record<CoverageCellState, ReactNode> = {
  general: <PublicOutlined sx={{ fontSize: 16 }} />,
  own: <CheckCircleOutline sx={{ fontSize: 16 }} color="success" />,
  missing: <ErrorOutline sx={{ fontSize: 16 }} color="warning" />,
}

function CoverageCell(props: { readonly state: CoverageCellState }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        color: props.state === "missing" ? "warning.main" : "text.primary",
      }}
    >
      {CELL_ICONS[props.state]}
      <Typography variant="caption" fontWeight={props.state === "missing" ? 700 : 500}>
        {s.coverageCell[props.state]}
      </Typography>
    </Box>
  )
}

/** Questions as rows grouped by category, projects as columns (md and up). */
export default function FaqCoverageGridCP() {
  const dispatch = useAppDispatch()
  const faqs = useAppSelector((state) => state.leadAssistant.faq.items)
  const projects = useLeadAssistantProjects()
  const groups = useMemo(() => buildFaqCoverage(faqs, projects), [faqs, projects])
  const columnCount = projects.length + 1
  return (
    <>
      {projects.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {s.coverageNoProjects}
        </Typography>
      ) : null}
      <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        <Table size="small" aria-label={s.coverageTableAria}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 260, position: "sticky", left: 0, bgcolor: "background.paper", zIndex: 1 }}>
                {s.coverageQuestionColumn}
              </TableCell>
              {projects.map((project) => (
                <TableCell key={project.id} sx={{ minWidth: 130 }}>
                  <Tooltip title={project.title}>
                    <Typography variant="caption" fontWeight={700} noWrap sx={{ display: "block", maxWidth: 150 }}>
                      {project.title}
                    </Typography>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <Fragment key={group.category}>
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    sx={{ bgcolor: "action.hover", py: 0.5 }}
                    component="th"
                    scope="colgroup"
                  >
                    <Typography variant="overline" sx={{ letterSpacing: 1 }}>
                      {s.faqCategories[group.category]}
                    </Typography>
                  </TableCell>
                </TableRow>
                {group.rows.map((row) => (
                  <TableRow key={row.faq.id} hover>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ position: "sticky", left: 0, bgcolor: "background.paper" }}
                    >
                      <Button
                        onClick={() => dispatch(openEditDrawerAct(row.faq))}
                        sx={{ textAlign: "left", justifyContent: "flex-start", textTransform: "none", p: 0.5 }}
                        color="inherit"
                      >
                        {row.faq.question}
                      </Button>
                      {!row.faq.enabled ? (
                        <Chip size="small" variant="outlined" label={s.faqDisabledChip} sx={{ ml: 1 }} />
                      ) : null}
                    </TableCell>
                    {projects.map((project) => (
                      <TableCell key={project.id}>
                        <CoverageCell state={row.cells[project.id] ?? "missing"} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
