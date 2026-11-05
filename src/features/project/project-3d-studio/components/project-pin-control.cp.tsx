import React from "react"
import { Alert, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import {
  EditLocationAlt as EditPinIcon,
  AddLocationAlt as AddPinIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { setActiveToolAct } from "../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"

export default function ProjectPinControlCP() {
  const dispatch = useAppDispatch()
  const { projectLatLng, activeTool } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const isPlacing = activeTool === "setProjectPin"
  const hasPin = projectLatLng !== null
  const label = hasPin ? s.projectPinRedefine : s.projectPinSetTool

  const togglePlace = () => {
    dispatch(setActiveToolAct(isPlacing ? "select" : "setProjectPin"))
  }

  return (
    <Stack
      spacing={1}
      sx={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 2,
        maxWidth: 320,
        pointerEvents: "none",
        "& > *": { pointerEvents: "auto" }
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title={label} placement="right">
          <IconButton
            aria-label={label}
            onClick={togglePlace}
            sx={{
              color: isPlacing ? "#0f172a" : hasPin ? "#38bdf8" : "#fbbf24",
              bgcolor: isPlacing
                ? "#38bdf8"
                : hasPin
                  ? "rgba(15,23,42,0.88)"
                  : "rgba(251,191,36,0.95)",
              border: "1px solid",
              borderColor: isPlacing
                ? "#7dd3fc"
                : hasPin
                  ? "#334155"
                  : "#f59e0b",
              boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
              "&:hover": {
                bgcolor: isPlacing
                  ? "#7dd3fc"
                  : hasPin
                    ? "rgba(30,41,59,0.95)"
                    : "#fbbf24"
              }
            }}
          >
            {hasPin ? <EditPinIcon /> : <AddPinIcon />}
          </IconButton>
        </Tooltip>
        {isPlacing && (
          <Typography
            variant="caption"
            sx={{
              color: "#e2e8f0",
              bgcolor: "rgba(15,23,42,0.88)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              border: "1px solid #334155"
            }}
          >
            {s.projectPinMissingHint}
          </Typography>
        )}
      </Stack>
      {!hasPin && !isPlacing && (
        <Alert
          severity="warning"
          sx={{
            py: 0.5,
            bgcolor: "rgba(15,23,42,0.92)",
            color: "#f8fafc",
            border: "1px solid #854d0e",
            "& .MuiAlert-icon": { color: "#fbbf24" }
          }}
          action={
            <IconButton
              size="small"
              aria-label={s.projectPinSetTool}
              onClick={() => dispatch(setActiveToolAct("setProjectPin"))}
              sx={{ color: "#fbbf24" }}
            >
              <AddPinIcon fontSize="small" />
            </IconButton>
          }
        >
          {s.projectPinMissingTitle}
        </Alert>
      )}
    </Stack>
  )
}
