import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import DisabledCampaignCP from "./components/disabled-campaign-cp"
import LoadingIndicator from "../../../app/components/loading-indicator"
import ConfigureCampaignCP from "./components/configure-campaign.cp"

export default function CampaignLeadView() {
  const loading = useAppSelector((state: RootState) => state.officeCampaign.loading)
  return (
    <>
      {/* <LoadingIndicator open={loading}/> */}
      <DisabledCampaignCP />  
      <ConfigureCampaignCP/>
    </>
  )
}