import { Box, Button, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import WebinarEventDetail from "../components/webinar-event-detail"
import WebinarEventFormDialog from "../components/webinar-event-form-dialog"
import WebinarEventsList from "../components/webinar-events-list"
import type { WebinarEventsListFilter } from "../types/webinar.types"

/**
 * Thin route shell: compose list/detail; only dialog open + filter chrome locally.
 */
export default function WebinarPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [eventsFilter, setEventsFilter] = useState<WebinarEventsListFilter>("all")

  return (
    <Box sx={{ p: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">{s.pageTitle}</Typography>
        <Button size="small" variant="contained" onClick={() => setIsCreateOpen(true)}>
          {s.newEvent}
        </Button>
      </Box>
      <Tabs
        value={eventsFilter}
        onChange={(_, value: WebinarEventsListFilter) => setEventsFilter(value)}
        sx={{ mb: 1, minHeight: 36, "& .MuiTab-root": { minHeight: 36, py: 0.5, px: 1.25 } }}
      >
        <Tab value="all" label={s.eventsFilterAll} />
        <Tab value="active" label={s.eventsFilterActive} />
        <Tab value="draft" label={s.eventsFilterDraft} />
        <Tab value="closed" label={s.eventsFilterClosed} />
      </Tabs>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 0.9fr) minmax(0, 2.1fr)",
          },
          gap: 1.25,
          alignItems: "start",
        }}
      >
        <WebinarEventsList filter={eventsFilter} />
        <WebinarEventDetail />
      </Box>
      <WebinarEventFormDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Box>
  )
}
