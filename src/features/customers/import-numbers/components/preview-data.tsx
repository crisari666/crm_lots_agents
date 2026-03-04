import PreviewRowsTableCP from "./preview-rows-table.cp";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect } from "react";
import { getCurrentCampaignThunk } from "../../../campaigns/current-campaign/current-campaign.slice";
import { LeadsWithUsers } from "../../../../app/models/leads-users-customer.interface";
import { distribuiteCustomersAct, setLeadUserMapAct } from "../import-numbers.slice";
import UserInterface from "../../../../app/models/user-interface";



export default function PreviewData() {
  const { currentCampaignGot, officesCampaigns, currentCampaign, leadsId, recalculateData } = useAppSelector(state => state.importNumbers)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(currentCampaignGot === false) dispatch(getCurrentCampaignThunk());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(currentCampaignGot === true && currentCampaign !== undefined && officesCampaigns.length > 0 && Object.keys(leadsId).length > 0){
      buildDataLeadUsers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } , [currentCampaignGot, officesCampaigns, currentCampaign, leadsId])

  useEffect(() => {
    dispatch(distribuiteCustomersAct())
  }, [recalculateData])

  const buildDataLeadUsers = async () => {
    //console.log({leadsId});
    let leadsMap: {[leadId: string] : LeadsWithUsers} = {}
    for await (const officeCampaign of officesCampaigns){
      const usersMap: any = {}
      for (const index in officeCampaign.users){
        const user = officeCampaign.users[index] as UserInterface
        usersMap[user._id!] = {
          _id: user,
          userDb: user,
          customers: []
        }
      }
      const leadId = (officeCampaign.user as any)._id;
      if(leadsId[leadId] !== undefined && leadsMap[leadId] === undefined){
        leadsMap[leadId] = {
          _id: leadId,
          office: officeCampaign.office,
          email: leadsId[leadId].email,
          lastName: leadsId[leadId].lastName,
          officeCampaignId: officeCampaign._id, 
          users: usersMap
        }
      }

    }
    dispatch(setLeadUserMapAct(leadsMap))
  }
  
  return(
    <PreviewRowsTableCP/>
  )
}