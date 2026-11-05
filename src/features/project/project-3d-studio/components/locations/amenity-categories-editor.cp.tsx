import React, { useState } from "react"
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import { updateExperienceThunk } from "../../slice/project-3d-studio.slice"
import type { AmenityCategoryType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
}

function toCategoryKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export default function AmenityCategoriesEditorCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(
    (state: RootState) => state.project3dStudio.experience?.amenityCategories ?? []
  )
  const [label, setLabel] = useState("")

  const saveCategories = (next: AmenityCategoryType[]) => {
    void dispatch(
      updateExperienceThunk({
        projectId,
        data: { amenityCategories: next }
      })
    )
  }

  const addCategory = () => {
    const key = toCategoryKey(label)
    if (!key || categories.some((row) => row.key === key)) return
    saveCategories([
      ...categories,
      { key, label: label.trim(), sortOrder: categories.length }
    ])
    setLabel("")
  }

  return (
    <Box sx={{ px: 1.5, pb: 1 }}>
      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
        {s.amenityCategoriesTitle}
      </Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
        {categories.map((row) => (
          <Stack key={row.key} direction="row" spacing={0.5} alignItems="center">
            <Box
              component="input"
              type="color"
              aria-label={`${s.amenityCategoryColor}: ${row.label}`}
              value={/^#[0-9A-Fa-f]{6}$/.test(row.color ?? "") ? row.color : "#38BDF8"}
              onChange={(event) =>
                saveCategories(
                  categories.map((item) =>
                    item.key === row.key
                      ? { ...item, color: event.target.value.toUpperCase() }
                      : item
                  )
                )
              }
              sx={{
                width: 28,
                height: 28,
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "pointer"
              }}
            />
            <Chip
              label={row.label}
              size="small"
              onDelete={() =>
                saveCategories(categories.filter((item) => item.key !== row.key))
              }
              sx={{ color: "#e2e8f0", borderColor: "#334155" }}
              variant="outlined"
            />
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          value={label}
          placeholder={s.amenityCategoryPlaceholder}
          onChange={(event) => setLabel(event.target.value)}
          fullWidth
        />
        <Button size="small" variant="outlined" onClick={addCategory}>
          {s.amenityCategoryAdd}
        </Button>
      </Stack>
    </Box>
  )
}
