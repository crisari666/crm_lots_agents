import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import {
  fetchJobCampaignCandidatesThunk,
  selectJobCampaignState,
  setJobCampaignCandidateSortAct,
} from "../slice/job-campaign.slice"
import type { JobCampaignCandidateSort } from "../types/job-campaign.types"

/** Switches the candidate list between most recent and best AI score. */
export function JobCandidateSortToggleCp() {
  const dispatch = useAppDispatch()
  const { candidateSort, selectedCampaignId } = useAppSelector(
    selectJobCampaignState,
  )

  const handleChange = (next: JobCampaignCandidateSort | null): void => {
    if (next == null || next === candidateSort) return
    dispatch(setJobCampaignCandidateSortAct(next))
    if (selectedCampaignId == null) return
    void dispatch(
      fetchJobCampaignCandidatesThunk({ campaignId: selectedCampaignId }),
    )
  }

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={candidateSort}
      onChange={(_, next: JobCampaignCandidateSort | null) => handleChange(next)}
    >
      <ToggleButton value="recent">{s.sortByRecent}</ToggleButton>
      <ToggleButton value="score">{s.sortByScore}</ToggleButton>
    </ToggleButtonGroup>
  )
}
