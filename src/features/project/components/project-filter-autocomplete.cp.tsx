import React, { useEffect } from "react"
import { Autocomplete, TextField } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchProjectsThunk } from "../slice/projects.slice"
import type { ProjectType } from "../types/project.types"

export type ProjectFilterAutocompleteCPProps = {
  /** Selected RAG project id; empty string = all / none. */
  readonly value: string
  readonly onChange: (projectId: string) => void
  readonly label?: string
  readonly disabled?: boolean
  readonly size?: "small" | "medium"
  readonly sx?: React.ComponentProps<typeof Autocomplete>["sx"]
  /** When true, selection is required (no clear to empty). */
  readonly disableClearable?: boolean
}

/**
 * Autocomplete over RAG projects (`fetchProjectsThunk`). Empty value means no filter / no project.
 */
export default function ProjectFilterAutocompleteCP({
  value,
  onChange,
  label = "Proyecto",
  disabled = false,
  size = "small",
  sx,
  disableClearable = false,
}: ProjectFilterAutocompleteCPProps): React.ReactElement {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((state) => state.projects.projects)
  const isLoading = useAppSelector((state) => state.projects.isLoading)

  useEffect(() => {
    if (projects.length === 0 && !isLoading) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projects.length, isLoading])

  const selected: ProjectType | undefined =
    value.trim() !== ""
      ? projects.find((project) => project._id === value)
      : undefined

  return (
    <Autocomplete
      size={size}
      sx={sx ?? { minWidth: { xs: "100%", sm: 220 } }}
      options={projects}
      value={selected}
      loading={isLoading}
      disabled={disabled}
      disableClearable={disableClearable || undefined}
      onChange={(_, option) => onChange(option?._id ?? "")}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(a, b) => a._id === b._id}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
