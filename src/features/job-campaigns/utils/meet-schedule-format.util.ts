import { MEET_TIME_ZONE } from "./job-campaign-defaults"

/** "28 de septiembre" in Colombia time, matching the `date_` template variable. */
export const formatMeetDate = (iso: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    timeZone: MEET_TIME_ZONE,
    day: "numeric",
    month: "long",
  }).format(new Date(iso))

/** "02:45 p. m." in Colombia time, matching the `time` template variable. */
export const formatMeetTime = (iso: string): string =>
  new Intl.DateTimeFormat("es-CO", {
    timeZone: MEET_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso))
