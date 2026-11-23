import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import { PointOfSale as PointOfSaleIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchProjectsThunk } from "../../project/slice/projects.slice"
import { fetchSalesDownPaymentsReportThunk } from "../slice/sales-down-payments-report.slice"
import type UserInterface from "../../../app/models/user-interface"
import type { ProjectType } from "../../project/types/project.types"
import { salesDownPaymentsReportStrings as s } from "../../../i18n/locales/sales-down-payments-report.strings"
import SalesReportFiltersCP, {
  type SalesReportStatusFilter,
} from "./sales-report-filters.cp"
import SalesReportKpiStripCP from "./sales-report-kpi-strip.cp"
import SalesReportChartsCP from "./sales-report-charts.cp"
import SalesReportTableCP, { SALES_REPORT_PAGE_SIZE } from "./sales-report-table.cp"

/**
 * Composes filters, KPIs, charts, and table for the sales report.
 */
export default function SalesReportContentCP() {
  const dispatch = useAppDispatch()
  const report = useAppSelector((state) => state.salesDownPaymentsReport.report)
  const isLoading = useAppSelector((state) => state.salesDownPaymentsReport.isLoading)
  const error = useAppSelector((state) => state.salesDownPaymentsReport.error)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const projects = useAppSelector((state) => state.projects.projects)
  const projectsLoaded = projects.length > 0
  const [dateStart, setDateStart] = useState<Date>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [dateEnd, setDateEnd] = useState<Date>(() => new Date())
  const [selectedAgent, setSelectedAgent] = useState<UserInterface | null>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [statusFilter, setStatusFilter] = useState<SalesReportStatusFilter>("")
  const [page, setPage] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])
  useEffect(() => {
    if (!projectsLoaded) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projectsLoaded])
  const physicalUsers = useMemo(
    () => usersOriginal.filter((user) => user.physical === true),
    [usersOriginal],
  )
  const enabledProjects = useMemo(
    () => projects.filter((p) => p.enabled !== false && p.deleted !== true),
    [projects],
  )
  const userById = useMemo(() => {
    const map = new Map<string, UserInterface>()
    usersOriginal.forEach((u) => {
      if (u._id) map.set(u._id, u)
    })
    return map
  }, [usersOriginal])
  const projectById = useMemo(() => {
    const map = new Map<string, string>()
    projects.forEach((p) => map.set(p._id, p.title))
    return map
  }, [projects])
  const resolveAgentName = useCallback(
    (userId: string): string => {
      const u = userById.get(userId)
      if (!u) return userId
      return `${u.name ?? ""} ${u.lastName ?? ""}`.trim() || userId
    },
    [userById],
  )
  const resolveProjectName = useCallback(
    (projectId: string, fallback?: string): string => {
      return projectById.get(projectId) ?? fallback ?? projectId
    },
    [projectById],
  )
  const runSearch = useCallback(
    (pageNum = 0) => {
      setPage(pageNum)
      setHasSearched(true)
      void dispatch(
        fetchSalesDownPaymentsReportThunk({
          dateFrom: dateStart.toISOString(),
          dateTo: dateEnd.toISOString(),
          recordedBy: selectedAgent?._id || undefined,
          projectId: selectedProject?._id || undefined,
          status: statusFilter || undefined,
          skip: pageNum * SALES_REPORT_PAGE_SIZE,
          limit: SALES_REPORT_PAGE_SIZE,
        }),
      )
    },
    [dispatch, dateStart, dateEnd, selectedAgent, selectedProject, statusFilter],
  )
  useEffect(() => {
    runSearch(0)
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const showEmpty =
    hasSearched && !isLoading && !error && (report?.total ?? 0) === 0
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: -0.4 }}>
          {s.pageTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {s.pageSubtitle}
        </Typography>
      </Box>
      <SalesReportFiltersCP
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateRangeChange={({ dateStart: ds, dateEnd: de }) => {
          setDateStart(ds)
          setDateEnd(de)
        }}
        agents={physicalUsers}
        selectedAgent={selectedAgent}
        onAgentChange={setSelectedAgent}
        projects={enabledProjects}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onSearch={() => runSearch(0)}
        isLoading={isLoading}
      />
      {error && <Alert severity="error">{error || s.errorLoad}</Alert>}
      <SalesReportKpiStripCP summary={report?.summary ?? null} isLoading={isLoading} />
      {isLoading && !report ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : showEmpty ? (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <PointOfSaleIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {s.emptyTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {s.emptyHint}
            </Typography>
          </CardContent>
        </Card>
      ) : report ? (
        <>
          <SalesReportChartsCP
            byAgent={report.byAgent}
            byDay={report.byDay}
            byProject={report.byProject}
            resolveAgentName={resolveAgentName}
            resolveProjectName={resolveProjectName}
          />
          {report.rows.length > 0 && (
            <SalesReportTableCP
              rows={report.rows}
              total={report.total}
              page={page}
              onPageChange={(nextPage) => runSearch(nextPage)}
              resolveAgentName={resolveAgentName}
              resolveProjectName={resolveProjectName}
            />
          )}
        </>
      ) : null}
    </Stack>
  )
}
