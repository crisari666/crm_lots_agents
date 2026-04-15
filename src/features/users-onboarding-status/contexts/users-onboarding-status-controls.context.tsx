import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { OnboardingStatusType } from "../types/onboarding-state.types"
import {
  deleteOnboardingFlowsBySelectedIdsThunk,
  fetchUsersOnboardingStatusThunk,
  recreateImportSchedulesForNeedsHumanWhatsappThunk,
  recreateImportSchedulesForSelectedUserIdsThunk,
  selectSelectedOrphanOnboardingRowIds,
  selectSelectedRescheduleUserIds,
  selectUsersOnboardingStatusFilteredItems,
  selectUsersOnboardingStatusState,
  setIncludeSpecificUpdateAct,
  setOnboardingDateRangeAct,
  setOnboardingSearchTermAct,
  setOnboardingStatusFilterAct
} from "../slice/users-onboarding-status.slice"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type UsersOnboardingStatusControlsContextType = {
  statusFilter: OnboardingStatusType | "all"
  includeSpecificUpdate: boolean
  searchTerm: string
  lastUpdateFrom: string
  lastUpdateTo: string
  totalRowCount: number
  visibleRowCount: number
  isLoading: boolean
  bulkDeleteFlowsLoading: boolean
  bulkRecreateSchedulesLoading: boolean
  selectedOrphanRowIdsCount: number
  selectedRescheduleUserIdsCount: number
  rescheduleFirstStep: UserImportFirstStepType | ""
  recreateError: string | null
  rescheduleSelectedError: string | null
  deleteDialogOpen: boolean
  deleteDialogError: string | null
  setRescheduleFirstStep: (next: UserImportFirstStepType | "") => void
  onChangeStatusFilter: (next: OnboardingStatusType | "all") => void
  onChangeIncludeSpecificUpdate: (next: boolean) => void
  onChangeSearchTerm: (next: string) => void
  onChangeDateRange: (next: { lastUpdateFrom: string; lastUpdateTo: string }) => void
  onRefresh: () => void
  onExportVisibleRows: () => void
  onRecreateSchedules: () => Promise<void>
  onRescheduleSelected: () => Promise<void>
  openDeleteDialog: () => void
  closeDeleteDialog: () => void
  confirmDeleteFlows: () => Promise<void>
}

const UsersOnboardingStatusControlsContext =
  createContext<UsersOnboardingStatusControlsContextType | null>(null)

export const onboardingStatuses: Array<OnboardingStatusType | "all"> = [
  "all",
  "Imported",
  "Scheduled",
  "WS_sent",
  "WS_video_sent",
  "WS_confirmar_capacitacion_dispatched",
  "WS_training_slots_list_sent",
  "WS_training_slot_selected",
  "Needs_human_whatsapp",
  "Interested",
  "Call_programmed",
  "Call_done_success",
  "Call_failed",
  "WS_training_sent",
  "Confirmed_training_request",
  "Call_voicemail",
  "Reschedule_due_twilio_number_occupiedt"
]

const isValidStatusFilter = (v: string): v is OnboardingStatusType | "all" =>
  (onboardingStatuses as readonly string[]).includes(v)

const sanitizeCsvCell = (value: string) => {
  const escaped = value.replaceAll(`"`, `""`)
  return `"${escaped}"`
}

const toUtcStartIso = (dateValue: string) => {
  if (dateValue.trim() === "") return ""
  return new Date(`${dateValue}T00:00:00`).toISOString()
}

const toUtcEndIso = (dateValue: string) => {
  if (dateValue.trim() === "") return ""
  return new Date(`${dateValue}T23:59:59.999`).toISOString()
}

export function UsersOnboardingStatusControlsProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const {
    items,
    statusFilter,
    includeSpecificUpdate,
    searchTerm,
    isLoading,
    bulkDeleteFlowsLoading,
    bulkRecreateSchedulesLoading,
    lastUpdateFrom,
    lastUpdateTo
  } = useAppSelector(selectUsersOnboardingStatusState)
  const filteredOnboardingRows = useAppSelector(selectUsersOnboardingStatusFilteredItems)
  const selectedOrphanRowIds = useAppSelector(selectSelectedOrphanOnboardingRowIds)
  const selectedRescheduleUserIds = useAppSelector(selectSelectedRescheduleUserIds)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null)
  const [recreateError, setRecreateError] = useState<string | null>(null)
  const [rescheduleSelectedError, setRescheduleSelectedError] = useState<string | null>(null)
  const [rescheduleFirstStep, setRescheduleFirstStep] = useState<UserImportFirstStepType | "">("")

  const resolvedFilter: OnboardingStatusType | "all" = isValidStatusFilter(statusFilter)
    ? statusFilter
    : "all"

  useEffect(() => {
    if (!deleteDialogOpen) setDeleteDialogError(null)
  }, [deleteDialogOpen])

  useEffect(() => {
    if (!isValidStatusFilter(statusFilter)) {
      dispatch(setOnboardingStatusFilterAct("all"))
      return
    }
    const status = statusFilter === "all" ? undefined : statusFilter
    dispatch(fetchUsersOnboardingStatusThunk({ status, lastUpdateFrom, lastUpdateTo, includeSpecificUpdate }))
  }, [dispatch, includeSpecificUpdate, statusFilter, lastUpdateFrom, lastUpdateTo])

  const onChangeStatusFilter = useCallback(
    (next: OnboardingStatusType | "all") => {
      dispatch(setOnboardingStatusFilterAct(next))
    },
    [dispatch]
  )

  const onChangeIncludeSpecificUpdate = useCallback(
    (next: boolean) => {
      dispatch(setIncludeSpecificUpdateAct(next))
    },
    [dispatch]
  )

  const onChangeSearchTerm = useCallback(
    (next: string) => {
      dispatch(setOnboardingSearchTermAct(next))
    },
    [dispatch]
  )

  const onChangeDateRange = useCallback(
    (next: { lastUpdateFrom: string; lastUpdateTo: string }) => {
      dispatch(
        setOnboardingDateRangeAct({
          lastUpdateFrom: toUtcStartIso(next.lastUpdateFrom),
          lastUpdateTo: toUtcEndIso(next.lastUpdateTo)
        })
      )
    },
    [dispatch]
  )

  const onRefresh = useCallback(() => {
    const status = resolvedFilter === "all" ? undefined : resolvedFilter
    dispatch(fetchUsersOnboardingStatusThunk({ status, lastUpdateFrom, lastUpdateTo, includeSpecificUpdate }))
  }, [dispatch, includeSpecificUpdate, lastUpdateFrom, lastUpdateTo, resolvedFilter])

  const onExportVisibleRows = useCallback(() => {
    const rows = filteredOnboardingRows.map((x) => ({
      user: x.userId ? `${x.userId.name} ${x.userId.lastName}`.trim() : "",
      phone: x.userId?.phone ?? "",
      email: x.userId?.email ?? "",
      status: x.status ?? ""
    }))
    const headers = [s.listColUser, s.listColPhone, s.listColEmail, s.listColStatus]
    const csvRows = [
      headers.map(sanitizeCsvCell).join(","),
      ...rows.map((row) =>
        [row.user, row.phone, row.email, row.status].map(sanitizeCsvCell).join(",")
      )
    ]
    const csvContent = `\uFEFF${csvRows.join("\n")}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const now = new Date()
    const y = now.getFullYear()
    const m = `${now.getMonth() + 1}`.padStart(2, "0")
    const d = `${now.getDate()}`.padStart(2, "0")
    link.href = url
    link.download = `onboarding-users-${y}${m}${d}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [filteredOnboardingRows])

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogError(null)
    setDeleteDialogOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    if (!bulkDeleteFlowsLoading) setDeleteDialogOpen(false)
  }, [bulkDeleteFlowsLoading])

  const confirmDeleteFlows = useCallback(async () => {
    setDeleteDialogError(null)
    const result = await dispatch(deleteOnboardingFlowsBySelectedIdsThunk(selectedOrphanRowIds))
    if (deleteOnboardingFlowsBySelectedIdsThunk.fulfilled.match(result)) {
      setDeleteDialogOpen(false)
      return
    }
    const payload = result.payload as string | undefined
    if (payload === "noSelection") {
      setDeleteDialogError(s.deleteFlowsNoSelection)
      return
    }
    setDeleteDialogError(
      payload != null && payload !== "deleteFailed" ? payload : s.deleteFlowsGenericError
    )
  }, [dispatch, selectedOrphanRowIds])

  const onRecreateSchedules = useCallback(async () => {
    setRecreateError(null)
    const result = await dispatch(recreateImportSchedulesForNeedsHumanWhatsappThunk())
    if (recreateImportSchedulesForNeedsHumanWhatsappThunk.fulfilled.match(result)) return
    const payload = result.payload as string | undefined
    if (payload === "noNeedsHumanWhatsappUsers") {
      setRecreateError(s.recreateSchedulesNoUsers)
      return
    }
    setRecreateError(
      payload != null && payload !== "recreateSchedulesFailed" ? payload : s.recreateSchedulesError
    )
  }, [dispatch])

  const onRescheduleSelected = useCallback(async () => {
    setRescheduleSelectedError(null)
    if (rescheduleFirstStep === "" || selectedRescheduleUserIds.length === 0) {
      setRescheduleSelectedError(s.rescheduleNoSelection)
      return
    }
    const result = await dispatch(
      recreateImportSchedulesForSelectedUserIdsThunk({ importFirstStep: rescheduleFirstStep })
    )
    if (recreateImportSchedulesForSelectedUserIdsThunk.fulfilled.match(result)) return
    const payload = result.payload as string | undefined
    if (payload === "noRescheduleSelection") {
      setRescheduleSelectedError(s.rescheduleNoSelection)
      return
    }
    setRescheduleSelectedError(
      payload != null && payload !== "recreateSchedulesFailed" ? payload : s.recreateSchedulesError
    )
  }, [dispatch, rescheduleFirstStep, selectedRescheduleUserIds.length])

  const value = useMemo(
    () => ({
      statusFilter: resolvedFilter,
      includeSpecificUpdate,
      searchTerm,
      lastUpdateFrom,
      lastUpdateTo,
      totalRowCount: items.length,
      visibleRowCount: filteredOnboardingRows.length,
      isLoading,
      bulkDeleteFlowsLoading,
      bulkRecreateSchedulesLoading,
      selectedOrphanRowIdsCount: selectedOrphanRowIds.length,
      selectedRescheduleUserIdsCount: selectedRescheduleUserIds.length,
      rescheduleFirstStep,
      recreateError,
      rescheduleSelectedError,
      deleteDialogOpen,
      deleteDialogError,
      setRescheduleFirstStep,
      onChangeStatusFilter,
      onChangeIncludeSpecificUpdate,
      onChangeSearchTerm,
      onChangeDateRange,
      onRefresh,
      onExportVisibleRows,
      onRecreateSchedules,
      onRescheduleSelected,
      openDeleteDialog,
      closeDeleteDialog,
      confirmDeleteFlows
    }),
    [
      bulkDeleteFlowsLoading,
      bulkRecreateSchedulesLoading,
      deleteDialogError,
      deleteDialogOpen,
      filteredOnboardingRows.length,
      includeSpecificUpdate,
      isLoading,
      items.length,
      lastUpdateFrom,
      lastUpdateTo,
      onChangeDateRange,
      onChangeIncludeSpecificUpdate,
      onChangeSearchTerm,
      onChangeStatusFilter,
      onExportVisibleRows,
      onRecreateSchedules,
      onRefresh,
      onRescheduleSelected,
      openDeleteDialog,
      closeDeleteDialog,
      confirmDeleteFlows,
      recreateError,
      rescheduleFirstStep,
      rescheduleSelectedError,
      resolvedFilter,
      searchTerm,
      selectedOrphanRowIds.length,
      selectedRescheduleUserIds.length
    ]
  )

  return (
    <UsersOnboardingStatusControlsContext.Provider value={value}>
      {children}
    </UsersOnboardingStatusControlsContext.Provider>
  )
}

export function useUsersOnboardingStatusControlsContext() {
  const context = useContext(UsersOnboardingStatusControlsContext)
  if (context == null) {
    throw new Error("useUsersOnboardingStatusControlsContext must be used within provider")
  }
  return context
}
