import { Box, LinearProgress, Tooltip, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadsStrings as s } from "../../../../i18n/locales/leads.strings"
import { fetchCustomerAdminDetailThunk } from "../../../customer-v2/redux/customer-v2.slice"
import { fetchOlderAssignmentTimelineThunk } from "../slice/assignment-timeline.slice"
import {
  TIMELINE_CHIP_HEIGHT,
  TIMELINE_CHIP_WIDTH,
  TIMELINE_LABEL_WIDTH,
  TIMELINE_LANE_HEIGHT,
  TIMELINE_RULER_HEIGHT,
  buildHourTicks,
  buildTimelineExtent,
  eventAnchorIso,
  formatEventLabel,
  listVentorIds,
  timeToOffsetPx,
} from "../business-logic/timeline-layout"
import type { AssignmentTimelineEvent } from "../types/assignment-timeline.types"

type UserRow = { readonly _id: string; readonly name?: string; readonly lastName?: string }

function ventorDisplayName(ventorId: string, users: readonly UserRow[]): string {
  const user = users.find((row) => row._id === ventorId)
  if (!user) {
    return ventorId.length > 10 ? `${ventorId.slice(0, 8)}…` : ventorId
  }
  return `${user.name ?? ""} ${user.lastName ?? ""}`.trim() || ventorId
}

function chipColor(event: AssignmentTimelineEvent): string {
  if (event.flowStrategy === "lead_conversation") {
    return "primary.main"
  }
  if (event.flowStrategy === "immediate_assign") {
    return "success.main"
  }
  return "grey.600"
}

/**
 * Video-editor style board: sticky ventor labels, horizontal time canvas, scroll-left loads older.
 */
export default function AssignmentTimelineBoardCP() {
  const dispatch = useAppDispatch()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const leftSentinelRef = useRef<HTMLDivElement | null>(null)
  const events = useAppSelector((state) => state.assignmentTimeline.events)
  const clockMode = useAppSelector((state) => state.assignmentTimeline.clockMode)
  const windowFrom = useAppSelector((state) => state.assignmentTimeline.windowFrom)
  const windowTo = useAppSelector((state) => state.assignmentTimeline.windowTo)
  const hasMoreOlder = useAppSelector((state) => state.assignmentTimeline.hasMoreOlder)
  const loadingOlder = useAppSelector((state) => state.assignmentTimeline.loadingOlder)
  const loading = useAppSelector((state) => state.assignmentTimeline.loading)
  const users = useAppSelector((state) => state.users.users) as UserRow[]

  const ventorIds = useMemo(() => listVentorIds(events), [events])
  const extent = useMemo(
    () => buildTimelineExtent(events, clockMode, windowFrom, windowTo),
    [events, clockMode, windowFrom, windowTo]
  )
  const ticks = useMemo(() => buildHourTicks(extent), [extent])

  useEffect(() => {
    const root = scrollRef.current
    const sentinel = leftSentinelRef.current
    if (!root || !sentinel) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((entry) => entry.isIntersecting)
        if (hit && hasMoreOlder && !loadingOlder && !loading) {
          void dispatch(fetchOlderAssignmentTimelineThunk())
        }
      },
      { root, rootMargin: "0px 0px 0px 120px", threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [dispatch, hasMoreOlder, loadingOlder, loading, events.length])

  if (loading && events.length === 0) {
    return <LinearProgress sx={{ mt: 2 }} />
  }

  if (!loading && events.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {s.timelineEmpty}
      </Typography>
    )
  }

  const boardHeight = TIMELINE_RULER_HEIGHT + Math.max(ventorIds.length, 1) * TIMELINE_LANE_HEIGHT

  return (
    <Box sx={{ position: "relative", border: 1, borderColor: "divider", borderRadius: 1 }}>
      {loadingOlder ? <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 3 }} /> : null}
      <Box sx={{ display: "flex", height: boardHeight, maxHeight: "58vh" }}>
        <Box
          sx={{
            width: TIMELINE_LABEL_WIDTH,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            zIndex: 2,
          }}
        >
          <Box sx={{ height: TIMELINE_RULER_HEIGHT, borderBottom: 1, borderColor: "divider" }} />
          {ventorIds.map((ventorId) => (
            <Box
              key={ventorId}
              sx={{
                height: TIMELINE_LANE_HEIGHT,
                px: 1,
                display: "flex",
                alignItems: "center",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" noWrap title={ventorDisplayName(ventorId, users)}>
                {ventorDisplayName(ventorId, users)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
            position: "relative",
          }}
        >
          <Box sx={{ position: "relative", width: extent.widthPx, height: boardHeight }}>
            <Box
              ref={leftSentinelRef}
              sx={{ position: "absolute", left: 0, top: 0, width: 8, height: "100%", zIndex: 1 }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: TIMELINE_RULER_HEIGHT,
                width: extent.widthPx,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              {ticks.map((tick) => {
                const left = timeToOffsetPx(new Date(tick.ms).toISOString(), extent)
                return (
                  <Typography
                    key={tick.ms}
                    variant="caption"
                    sx={{
                      position: "absolute",
                      left,
                      top: 8,
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      color: "text.secondary",
                      fontSize: 10,
                    }}
                  >
                    {tick.label}
                  </Typography>
                )
              })}
            </Box>
            {ventorIds.map((ventorId, laneIndex) => {
              const top = TIMELINE_RULER_HEIGHT + laneIndex * TIMELINE_LANE_HEIGHT
              const laneEvents = events.filter((event) => event.ventorId === ventorId)
              return (
                <Box
                  key={ventorId}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top,
                    width: extent.widthPx,
                    height: TIMELINE_LANE_HEIGHT,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  {ticks.map((tick) => {
                    const left = timeToOffsetPx(new Date(tick.ms).toISOString(), extent)
                    return (
                      <Box
                        key={`${ventorId}-${tick.ms}`}
                        sx={{
                          position: "absolute",
                          left,
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          bgcolor: "divider",
                          opacity: 0.5,
                        }}
                      />
                    )
                  })}
                  {laneEvents.map((event) => {
                    const left = timeToOffsetPx(eventAnchorIso(event, clockMode), extent)
                    const title = [
                      formatEventLabel(event),
                      event.customerPhone,
                      `${s.timelineClockAssigned}: ${new Date(event.assignedAt).toLocaleString("es-CO")}`,
                      `${s.timelineClockArrived}: ${new Date(event.arrivedAt).toLocaleString("es-CO")}`,
                      event.flowStrategy
                        ? event.flowStrategy === "immediate_assign"
                          ? s.timelineFlowImmediate
                          : s.timelineFlowConversation
                        : s.timelineFlowUnknown,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                    return (
                      <Tooltip key={event.id} title={title} arrow>
                        <Box
                          component="button"
                          type="button"
                          onClick={() => {
                            void dispatch(fetchCustomerAdminDetailThunk(event.customerId))
                          }}
                          sx={{
                            position: "absolute",
                            left: Math.max(0, left - TIMELINE_CHIP_WIDTH / 2),
                            top: (TIMELINE_LANE_HEIGHT - TIMELINE_CHIP_HEIGHT) / 2,
                            width: TIMELINE_CHIP_WIDTH,
                            height: TIMELINE_CHIP_HEIGHT,
                            border: 0,
                            borderRadius: 1,
                            bgcolor: chipColor(event),
                            color: "common.white",
                            px: 1,
                            cursor: "pointer",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: 11,
                            fontWeight: 600,
                            transition: "opacity 200ms",
                            "&:hover": { opacity: 0.88 },
                          }}
                        >
                          {formatEventLabel(event)}
                        </Box>
                      </Tooltip>
                    )
                  })}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
