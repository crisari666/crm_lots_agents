import React, { useState } from "react"
import { Box, Button, Stack } from "@mui/material"
import UnfoldMore from "@mui/icons-material/UnfoldMore"
import UnfoldLess from "@mui/icons-material/UnfoldLess"
import ProjectFormGeneralSectionCP from "./project-form-general-section.cp"
import ProjectFormLocationSectionCP from "./project-form-location-section.cp"
import ProjectFormSalesSectionCP from "./project-form-sales-section.cp"
import ProjectFormMediaSectionsCP, {
  ProjectFormMediaSectionsCPProps
} from "./project-form-media-sections.cp"
import ProjectFormSectionCP from "./project-form-section.cp"
import ProjectAmenitiesGroupsFieldCP from "./project-amenities-groups-field.cp"
import {
  PROJECT_FORM_SECTION_IDS,
  ProjectFormSectionId,
  ProjectFormSectionToggleProps
} from "../types/project-form-section.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import { formatSectionSummary } from "../utils/format-section-summary.util"

type ProjectFormCPProps = Omit<ProjectFormMediaSectionsCPProps, keyof ProjectFormSectionToggleProps> & {
  legalSlot?: React.ReactNode
}

const DEFAULT_EXPANDED: ProjectFormSectionId[] = ["general"]

export default function ProjectFormCP({ legalSlot, ...props }: ProjectFormCPProps) {
  const { form, onChange, disabled = false } = props
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(DEFAULT_EXPANDED))
  const isExpanded = (id: ProjectFormSectionId): boolean => expanded.has(id)
  const onToggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const isAllExpanded = PROJECT_FORM_SECTION_IDS.every(
    (id) => expanded.has(id) || (id === "legal" && !legalSlot)
  )
  const toggleAll = () => {
    setExpanded(isAllExpanded ? new Set() : new Set(PROJECT_FORM_SECTION_IDS))
  }
  const toggleProps: ProjectFormSectionToggleProps = { isExpanded, onToggle }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          type="button"
          size="small"
          onClick={toggleAll}
          startIcon={isAllExpanded ? <UnfoldLess /> : <UnfoldMore />}
        >
          {isAllExpanded ? s.formCollapseAll : s.formExpandAll}
        </Button>
      </Box>
      <Stack spacing={1.5}>
        <ProjectFormGeneralSectionCP form={form} onChange={onChange} disabled={disabled} {...toggleProps} />
        <ProjectFormLocationSectionCP form={form} onChange={onChange} disabled={disabled} {...toggleProps} />
        <ProjectFormSalesSectionCP form={form} onChange={onChange} disabled={disabled} {...toggleProps} />
        <ProjectFormSectionCP
          id="amenities"
          title={s.formSectionAmenitiesGroups}
          summary={
            form.amenitiesGroups.length > 0
              ? formatSectionSummary(s.formSummaryGroups, form.amenitiesGroups.length)
              : s.formSummaryEmpty
          }
          expanded={isExpanded("amenities")}
          onToggle={onToggle}
          useGrid={false}
        >
          <ProjectAmenitiesGroupsFieldCP
            value={form.amenitiesGroups}
            onChange={(amenitiesGroups) => onChange({ amenitiesGroups })}
            disabled={disabled}
          />
        </ProjectFormSectionCP>
        <ProjectFormMediaSectionsCP {...props} {...toggleProps} />
        {legalSlot && (
          <ProjectFormSectionCP
            id="legal"
            title={s.formSectionLegal}
            expanded={isExpanded("legal")}
            onToggle={onToggle}
            useGrid={false}
          >
            {legalSlot}
          </ProjectFormSectionCP>
        )}
      </Stack>
    </Box>
  )
}
