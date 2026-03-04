import { CampaignInterface } from "../../../app/models/campaign.interface";
import { OfficeCampaignInterface } from "../../../app/models/office-campaign.interface";
import { OfficeLeadsWithUsers } from "../../../app/models/office-leads-with-users.interface";

export type CurrentCampaignStateI = {
  currentCampaign?: CampaignInterface;
  currentCampaignGot: boolean,
  officesCampaigns: OfficeCampaignInterface[]
  offices: OfficeLeadsWithUsers[]
  loading: boolean,
}