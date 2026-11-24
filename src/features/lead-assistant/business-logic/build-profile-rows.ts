import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import type { LeadProfile } from "../types/lead-assistant.types"

export type LeadProfileRow = { readonly label: string; readonly value: string }

/** Maps a lead profile into labelled rows, omitting unknown fields. */
export function buildProfileRows(profile: LeadProfile): LeadProfileRow[] {
  const rows: { label: string; value: string | undefined }[] = [
    { label: s.profileLabels.motivation, value: profile.motivation != null ? s.profileValues.motivation[profile.motivation] : undefined },
    { label: s.profileLabels.experience, value: profile.experience != null ? s.profileValues.experience[profile.experience] : undefined },
    { label: s.profileLabels.paymentMethod, value: profile.paymentMethod != null ? s.profileValues.paymentMethod[profile.paymentMethod] : undefined },
    { label: s.profileLabels.timeline, value: profile.timeline != null ? s.profileValues.timeline[profile.timeline] : undefined },
    { label: s.profileLabels.budget, value: profile.budget },
    { label: s.profileLabels.lotPreference, value: profile.lotPreference },
    { label: s.profileLabels.mainObjection, value: profile.mainObjection },
  ]
  return rows.filter((row): row is { label: string; value: string } => row.value != null && row.value.length > 0)
}
