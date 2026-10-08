import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { refreshJobCampaignCandidatesThunk } from "../slice/job-campaign.slice"
import type { JobCampaignCandidateItem } from "../types/job-campaign.types"

const MEET_POLL_INTERVAL_MS = 10_000
const RECENT_SENT_WINDOW_MS = 5 * 60_000

const isAwaitingMeetUpdate = (candidate: JobCampaignCandidateItem): boolean => {
  const message = candidate.meetMessage
  if (message == null) return false
  if (message.status === "queued" || message.status === "sending") return true
  return (
    message.status === "sent" &&
    Date.now() - new Date(message.updatedAt).getTime() < RECENT_SENT_WINDOW_MS
  )
}

/**
 * Refreshes candidates while group Meet messages are queued/sending, or were sent in the
 * last few minutes (to catch the delivered/read/spam webhooks).
 */
export function useMeetDispatchPolling(campaignId: string): void {
  const dispatch = useAppDispatch()
  const isAwaiting = useAppSelector((state) =>
    state.jobCampaign.candidates.some(isAwaitingMeetUpdate),
  )
  useEffect(() => {
    if (!isAwaiting) return
    const timer = window.setInterval(() => {
      void dispatch(refreshJobCampaignCandidatesThunk({ campaignId }))
    }, MEET_POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [campaignId, dispatch, isAwaiting])
}
