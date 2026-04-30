import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { ViewColumn as ViewColumnIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import {
  clearStaffPerformanceReportAct,
  fetchStaffPerformanceReportThunk,
} from "../redux/staff-performance-report.slice"
import StaffPerformanceReportFiltersCP from "./staff-performance-report-filters.cp"

const COLUMN_VISIBILITY_STORAGE_KEY = "staffPerformanceReport.columnVisibility.v1"

type ColumnVisibility = {
  calls: boolean
  stepVisibility: Record<string, boolean>
}

function readColumnVisibility(): ColumnVisibility | null {
  try {
    const raw = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY)
    if (raw === null || raw === "") {
      return null
    }
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== "object" || parsed === null) {
      return null
    }
    const o = parsed as Record<string, unknown>
    const calls = o.calls === true || o.calls === false ? o.calls : true
    const stepVisibility =
      typeof o.stepVisibility === "object" && o.stepVisibility !== null && !Array.isArray(o.stepVisibility)
        ? (o.stepVisibility as Record<string, boolean>)
        : {}
    return { calls, stepVisibility }
  } catch {
    return null
  }
}

function writeColumnVisibility(visibility: ColumnVisibility): void {
  localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(visibility))
}

function defaultVisibility(stepIds: readonly string[]): ColumnVisibility {
  const stepVisibility: Record<string, boolean> = {}
  stepIds.forEach((id) => {
    stepVisibility[id] = true
  })
  return { calls: true, stepVisibility }
}

function mergeVisibility(
  preferences: ColumnVisibility | null,
  stepIds: readonly string[]
): ColumnVisibility {
  const base = defaultVisibility(stepIds)
  if (preferences === null) {
    return base
  }
  const stepVisibility: Record<string, boolean> = { ...base.stepVisibility }
  stepIds.forEach((id) => {
    if (preferences.stepVisibility[id] === false) {
      stepVisibility[id] = false
    }
  })
  return {
    calls: preferences.calls !== false,
    stepVisibility,
  }
}

function readInitialColumnVisibilityFromStorage(): ColumnVisibility {
  const stored = readColumnVisibility()
  if (stored === null) {
    return { calls: true, stepVisibility: {} }
  }
  return {
    calls: stored.calls !== false,
    stepVisibility: { ...stored.stepVisibility },
  }
}

function toStartOfDayIso(dateStr: string): string {
  return `${dateStr}T00:00:00.000Z`
}

function toEndOfDayIso(dateStr: string): string {
  return `${dateStr}T23:59:59.999Z`
}

function createDefaultDateRange(): { dateStart: Date; dateEnd: Date } {
  const dateEnd = new Date()
  const dateStart = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 1)
  return { dateStart, dateEnd }
}

function formatLocalYyyyMmDd(date: Date): string {
  const y: number = date.getFullYear()
  const m: string = String(date.getMonth() + 1).padStart(2, "0")
  const day: string = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getOfficeIdFromUser(user: { office?: unknown }): string {
  if (typeof user.office === "string") {
    return user.office
  }
  if (typeof user.office === "object" && user.office !== null && "_id" in user.office) {
    return String((user.office as { _id?: string })._id ?? "")
  }
  return ""
}

export default function StaffPerformanceReportContentCP() {
  const dispatch = useAppDispatch()
  const offices = useAppSelector((s) => s.offices.offices)
  const gotOffices = useAppSelector((s) => s.offices.gotOffices)
  const gotUsers = useAppSelector((s) => s.users.gotUsers)
  const usersOriginal = useAppSelector((s) => s.users.usersOriginal)
  const report = useAppSelector((s) => s.staffPerformanceReport.report)
  const loading = useAppSelector((s) => s.staffPerformanceReport.loading)
  const error = useAppSelector((s) => s.staffPerformanceReport.error)

  const [officeId, setOfficeId] = useState("")
  const [{ dateStart, dateEnd }, setDateRange] = useState(createDefaultDateRange)
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(readInitialColumnVisibilityFromStorage)
  const [localHint, setLocalHint] = useState<string | null>(null)

  useEffect(() => {
    if (!gotOffices) {
      void dispatch(getOfficesThunk())
    }
  }, [dispatch, gotOffices])

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  useEffect(() => {
    return () => {
      dispatch(clearStaffPerformanceReportAct())
    }
  }, [dispatch])

  useEffect(() => {
    if (report === null || report.stepsMeta.length === 0) {
      return
    }
    const ids = report.stepsMeta.map((s) => s.id)
    setColumnVisibility(() => {
      const stored = readColumnVisibility()
      const preferences: ColumnVisibility =
        stored !== null
          ? { calls: stored.calls !== false, stepVisibility: { ...stored.stepVisibility } }
          : { calls: true, stepVisibility: {} }
      const merged = mergeVisibility(preferences, ids)
      writeColumnVisibility(merged)
      return merged
    })
  }, [report])

  const persistVisibility = useCallback((next: ColumnVisibility) => {
    writeColumnVisibility(next)
    setColumnVisibility(next)
  }, [])

  const runReport = useCallback(() => {
    if (officeId === "") {
      return
    }
    const physicalForOffice = usersOriginal.filter(
      (u) => u.physical === true && getOfficeIdFromUser(u) === officeId
    )
    if (physicalForOffice.length === 0) {
      setLocalHint("No hay usuarios físicos en esta oficina.")
      return
    }
    setLocalHint(null)
    const userIds = physicalForOffice.map((u) => String(u._id))
    const userDisplayNames: Record<string, string> = {}
    physicalForOffice.forEach((u) => {
      const id = String(u._id)
      const label = `${(u.name || "").trim()} ${(u.lastName || "").trim()}`.trim()
      userDisplayNames[id] = label.length > 0 ? label : id
    })
    const dateFrom: string = formatLocalYyyyMmDd(dateStart)
    const dateTo: string = formatLocalYyyyMmDd(dateEnd)
    void dispatch(
      fetchStaffPerformanceReportThunk({
        userIds,
        userDisplayNames,
        assignedFrom: toStartOfDayIso(dateFrom),
        assignedTo: toEndOfDayIso(dateTo),
      })
    )
  }, [dispatch, officeId, dateStart, dateEnd, usersOriginal])

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Rendimiento personal (físicos)
      </Typography>
      <StaffPerformanceReportFiltersCP
        offices={offices}
        officeId={officeId}
        onOfficeIdChange={setOfficeId}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateRangeChange={setDateRange}
        onRunReport={runReport}
        isRunDisabled={loading || officeId === ""}
        runButtonLabel={loading ? "Cargando…" : "Consultar"}
        trailingActions={
          <>
            <IconButton
              aria-label="columnas"
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              disabled={report === null}
              sx={{ cursor: "pointer" }}
            >
              <ViewColumnIcon />
            </IconButton>
            <Menu
              anchorEl={columnMenuAnchor}
              open={columnMenuAnchor !== null}
              onClose={() => setColumnMenuAnchor(null)}
            >
              <MenuItem onClick={(e) => e.stopPropagation()} disableRipple sx={{ display: "block" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={columnVisibility.calls}
                      onChange={(_, checked) =>
                        persistVisibility({ ...columnVisibility, calls: checked })
                      }
                    />
                  }
                  label="Llamadas (resumen)"
                />
              </MenuItem>
              {(report?.stepsMeta ?? []).map((step) => (
                <MenuItem key={step.id} onClick={(e) => e.stopPropagation()} disableRipple sx={{ display: "block" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnVisibility.stepVisibility[step.id] !== false}
                        onChange={(_, checked) =>
                          persistVisibility({
                            ...columnVisibility,
                            stepVisibility: {
                              ...columnVisibility.stepVisibility,
                              [step.id]: checked,
                            },
                          })
                        }
                      />
                    }
                    label={step.name || step.id}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        }
      />
      {localHint !== null ? (
        <Typography color="warning.main" sx={{ mb: 2 }}>
          {localHint}
        </Typography>
      ) : null}
      {error !== null ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : null}
      {report !== null ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Clientes asignados (rango)</TableCell>
                {columnVisibility.calls ? (
                  <>
                    <TableCell align="right">Llamadas</TableCell>
                    <TableCell align="right">Contestadas</TableCell>
                    <TableCell align="right">No contestadas</TableCell>
                    <TableCell align="right">Fallidas</TableCell>
                  </>
                ) : null}
                {(report.stepsMeta ?? []).map((step) =>
                  columnVisibility.stepVisibility[step.id] === false ? null : (
                    <TableCell key={step.id} align="right">
                      {step.name}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {report.rows.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell align="right">{row.totalAssignedInRange}</TableCell>
                  {columnVisibility.calls ? (
                    <>
                      <TableCell align="right">{row.calls.totalCalls}</TableCell>
                      <TableCell align="right">{row.calls.answered}</TableCell>
                      <TableCell align="right">{row.calls.dontAnswered}</TableCell>
                      <TableCell align="right">{row.calls.failed}</TableCell>
                    </>
                  ) : null}
                  {(report.stepsMeta ?? []).map((step) =>
                    columnVisibility.stepVisibility[step.id] === false ? null : (
                      <TableCell key={step.id} align="right">
                        {row.steps[step.id] ?? 0}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  )
}
