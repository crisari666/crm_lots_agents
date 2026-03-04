import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import CampaignDisableCp from "./campaign-disable-cp"
import { getCurrentCampaignThunk, getOfficeLeadsWithUsersThunk } from "../current-campaign.slice"
import CurrentCampaignData from "./current-campaign-data"
import OfficesLeadsUsersCP from "./offices-leads-users.cp"

export default function CurrentCampaignWrapper() {
  const { currentCampaignGot, currentCampaign } = useAppSelector((state: RootState) => state.currentCampaign)
  const { currentUser } = useAppSelector((state: RootState) => state.login)
  
  const dispatch = useAppDispatch()
  useEffect(() =>{
    if(currentCampaignGot === false) {
      dispatch(getCurrentCampaignThunk())
      dispatch(getOfficeLeadsWithUsersThunk())
    }

  }, [])
  return(
    <>
      {/* <LoadingIndicator open={loading}/> */}
      {currentCampaignGot === true && !currentCampaign && <CampaignDisableCp  />} 
      {currentCampaignGot === true && currentCampaign && <>
        <CurrentCampaignData />
        <OfficesLeadsUsersCP/>
      </>}
      
    </>
  )

}