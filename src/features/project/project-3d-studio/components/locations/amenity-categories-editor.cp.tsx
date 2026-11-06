import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  setAmenityCategoriesAct,
  updateExperienceThunk
} from "../../slice/project-3d-studio.slice"
import type { AmenityCategoryType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
}

function toSavedCategory(row: AmenityCategoryType): AmenityCategoryType {
  const color = row.color?.trim().toUpperCase() ?? ""
  if (!/^#[0-9A-F]{6}$/.test(color)) {
    return { key: row.key, label: row.label, sortOrder: row.sortOrder }
  }
  return { key: row.key, label: row.label, sortOrder: row.sortOrder, color }
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
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [draftLabel, setDraftLabel] = useState("")
  const skipBlurRef = useRef(false)
  const committedRef = useRef(categories)
  const pendingRef = useRef(false)
  const saveTimerRef = useRef<number | null>(null)
  useEffect(() => {
    if (pendingRef.current) return
    committedRef.current = categories
  }, [categories])

  const saveCategories = (next: AmenityCategoryType[], debounceMs = 0) => {
    pendingRef.current = true
    dispatch(setAmenityCategoriesAct(next))
    if (saveTimerRef.current != null) window.clearTimeout(saveTimerRef.current)
    const send = () => {
      saveTimerRef.current = null
      void dispatch(
        updateExperienceThunk({
          projectId,
          data: { amenityCategories: next.map(toSavedCategory) }
        })
      )
        .unwrap()
        .then(() => {
          pendingRef.current = false
          committedRef.current = next
        })
        .catch(() => {
          pendingRef.current = false
          dispatch(setAmenityCategoriesAct(committedRef.current))
        })
    }
    if (debounceMs <= 0) {
      send()
      return
    }
    saveTimerRef.current = window.setTimeout(send, debounceMs)
  }

  const cancelRename = () => {
    setEditingKey(null)
    setDraftLabel("")
  }
  const commitRename = (row: AmenityCategoryType) => {
    const nextLabel = draftLabel.trim()
    const slug = toCategoryKey(nextLabel)
    const conflicts = categories.some(
      (item) => item.key !== row.key && item.key === slug
    )
    if (!nextLabel || !slug || conflicts) {
      cancelRename()
      return
    }
    if (nextLabel !== row.label) {
      saveCategories(
        categories.map((item) =>
          item.key === row.key ? { ...item, label: nextLabel } : item
        )
      )
    }
    cancelRename()
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
                  ),
                  300
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
            {editingKey === row.key ? (
              <TextField
                size="small"
                autoFocus
                value={draftLabel}
                label={s.amenityCategoryRename}
                onChange={(event) => setDraftLabel(event.target.value)}
                onBlur={() => {
                  if (skipBlurRef.current) {
                    skipBlurRef.current = false
                    return
                  }
                  commitRename(row)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault()
                    skipBlurRef.current = true
                    cancelRename()
                  }
                  if (event.key === "Enter") {
                    event.preventDefault()
                    skipBlurRef.current = true
                    commitRename(row)
                  }
                }}
                inputProps={{ "aria-label": s.amenityCategoryRename }}
              />
            ) : (
              <Chip
                label={row.label}
                size="small"
                onClick={() => {
                  setEditingKey(row.key)
                  setDraftLabel(row.label)
                }}
                onDelete={() =>
                  saveCategories(categories.filter((item) => item.key !== row.key))
                }
                sx={{ color: "#e2e8f0", borderColor: "#334155" }}
                variant="outlined"
              />
            )}
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
