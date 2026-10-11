import React from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  Typography
} from "@mui/material"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectFormSectionCPProps = {
  id: string
  title: string
  summary?: string
  hasError?: boolean
  expanded: boolean
  onToggle: (id: string) => void
  useGrid?: boolean
  children: React.ReactNode
}

export default function ProjectFormSectionCP({
  id,
  title,
  summary,
  hasError = false,
  expanded,
  onToggle,
  useGrid = true,
  children
}: ProjectFormSectionCPProps) {
  const summaryId = `project-section-${id}-summary`
  const detailsId = `project-section-${id}-details`
  return (
    <Accordion
      disableGutters
      variant="outlined"
      expanded={expanded}
      onChange={() => onToggle(id)}
      TransitionProps={{ unmountOnExit: false }}
      sx={{
        borderRadius: 1,
        "&:before": { display: "none" },
        borderColor: hasError ? "error.main" : "divider",
        transition: "border-color 200ms ease"
      }}
    >
      <AccordionSummary
        id={summaryId}
        aria-controls={detailsId}
        expandIcon={<ExpandMore />}
        sx={{
          px: 2,
          minHeight: 56,
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 2,
            my: 1.5,
            minWidth: 0
          }
        }}
      >
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, flexShrink: 0 }}>
          {title}
        </Typography>
        {hasError && (
          <Chip size="small" color="error" variant="outlined" label={s.formSectionNeedsAttention} />
        )}
        {summary && !expanded && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ ml: "auto", pr: 1, minWidth: 0 }}
          >
            {summary}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails
        id={detailsId}
        aria-labelledby={summaryId}
        sx={{ px: 2, pt: 0, pb: 2.5 }}
      >
        {useGrid ? (
          <Grid container spacing={2}>
            {children}
          </Grid>
        ) : (
          <Box>{children}</Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
