import type { JobCampaignAdminItem } from "../types/job-campaign.types"

/** True when the campaign can send the group Meet WhatsApp template. */
export const hasCampaignGroupMeet = (campaign: JobCampaignAdminItem): boolean =>
  campaign.meetScheduledAt != null &&
  campaign.googleMeetUrl.length > 0 &&
  campaign.meetTemplateName.trim().length > 0
