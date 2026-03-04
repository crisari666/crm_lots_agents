import { UserCustomersCampaignDataType } from "../../features/campaigns/campaign-customers/redux/campaign-customers-state";
import { OfficesUtlityData } from "../../features/download-payment/business-logic/download-payment-history.state";
import { MultiplePercentageType } from "../../features/download-payment/business-logic/download-payment.state";
import { OfficeGoalsResumeType } from "../../features/download-payment/business-logic/office-goals-resume.type";
import Api from "../axios";
import { CampaignInterface } from "../models/campaign.interface";
import { GetCampaignListType } from "../models/get-campaign-list.type";
import { OfficeCampaignInterface } from "../models/office-campaign.interface";

export async function getCurrentCampaignReq(): Promise<{campaign: CampaignInterface, officesCampaigns: OfficeCampaignInterface[]}>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `campaigns/current`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON METHOD');
    console.error({error});
    throw error;
  }
}

export async function createCampaignReq(): Promise<CampaignInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `campaigns`, data: {}})
    console.log('create', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON create');
    console.error({error});
    throw error;
  }
}

export async function getCampaignForLeadReq(): Promise<{campaign?: CampaignInterface, officeCampaign?: OfficeCampaignInterface}>  {
  try {
    const api = Api.getInstance()
    const campaignForLead = await api.get({path: `campaigns/campaign-for-lead`})
    const { error } = campaignForLead
    if(error == null) {
      return campaignForLead.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCampaignForLead');
    console.error({error});
    throw error;
  }
}

export async function addUsersToCampaignReq({users} : {users : string[]}): Promise<OfficeCampaignInterface>  {
  try {
    const api = Api.getInstance()

    const response = await api.post({path: `campaigns/addUsers`, data: {users} })
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addUsersToCampaign');
    console.error({error});
    throw error;
  }
}

export async function addUsersDatabase({users} : {users : string[]}): Promise<OfficeCampaignInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `campaigns/addUsersDatabase`, data: {users} })
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addUsersToCampaign');
    console.error({error});
    throw error;
  }
}

export async function switchCampaignReq({enable} : {enable : boolean}): Promise<CampaignInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/current/${enable}`, data: {}})
    console.log('switchCampaignReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON switchCampaignReq');
    console.error({error});
    throw error;
  }
}

export async function toggleSingleUserFromCampaignReq({userId, officeCampaignId} : {userId : string, officeCampaignId: string}): Promise<OfficeCampaignInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.put({path: `campaigns/toggle-single-user-to-campaign`, data: {userId, officeCampaignId}})
    console.log('toggleSingleUserFromCampaign', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleSingleUserFromCampaign');
    console.error({error});
    throw error;
  }
}
export async function toggleSingleUserFromCampaignDatabaseReq({userId, officeCampaignId} : {userId : string, officeCampaignId: string}): Promise<OfficeCampaignInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.put({path: `campaigns/toggle-single-user-to-campaign-database`, data: {userId, officeCampaignId}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleSingleUserFromCampaign');
    console.error({error});
    throw error;
  }
}

export async function toggleAllowModifyOfficeCampaignReq({officeId, allow, officeIndex} : {officeId : string, allow: boolean, officeIndex: number, }): Promise<{officeCampaign: OfficeCampaignInterface, officeIndex: number}>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/toggle-allow-modify-office-users-campaign/${officeId}/${allow}`})
    const { error } = response
    if(error == null) {
      return {officeCampaign: response.result, officeIndex}
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleAllowModifyOfficeCampaing');
    console.error({error});
    throw error;
  }
}

export async function toggleAllowModifyOfficeCampaignDatabaseReq({officeId, allow, officeIndex} : {officeId : string, allow: boolean, officeIndex: number, }): Promise<{officeCampaign: OfficeCampaignInterface, officeIndex: number}>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/toggle-allow-modify-office-users-campaign-database/${officeId}/${allow}`})
    console.log('toggleAllowModifyOfficeCampaing', {response});
    const { error } = response
    if(error == null) {
      return {officeCampaign: response.result, officeIndex}
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleAllowModifyOfficeCampaing');
    console.error({error});
    throw error;
  }
}

export async function toggleEnableCampaignDatabaseReq({campaignId, enable} : {campaignId : string, enable: boolean}): Promise<CampaignInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/toggle-enable-database-campaign/${campaignId}/${enable}`})
    console.log('toggleEnableCampaignDatabase', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleEnable  12CampaignDatabase');
    console.error({error});
    throw error;
  }
}

export async function getCampaignsListReq(): Promise<GetCampaignListType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `campaigns/get-campaigns-history`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCampaignsList');
    console.error({error});
    throw error;
  }
}

export async function saveCampaignUtilityReq({campaignId, mainUtility, partners, platform, negativeValue, utilityLeads, officesUtility} : {campaignId: string, mainUtility: number, partners: MultiplePercentageType, platform: number, negativeValue: number, utilityLeads: number, officesUtility: OfficesUtlityData}): Promise<any>{
  try {
    const data = {
      campaign: campaignId,
      mainUtility,
      partners,
      platform,
      negativeValue,
      utilityLeads,
      officesUtility
    }
    console.log('saveCampaignUtility', {data});
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/set-campaign-utility`, data})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON saveCampaignUtility');
    console.error({error});
    throw error;
  }
}

export async function getCampaignByIdReq({campaignId} : {campaignId : string}): Promise<CampaignInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `campaigns/${campaignId}`})
    const { error } = response
    if(error == null) {
      return response.result.campaign
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCampaignByIdReq');
    console.error({error});
    throw error;
  }
}

export async function getCampaignUsersDataReq(campaignId: string): Promise<UserCustomersCampaignDataType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `campaigns/users-campaign-data/${campaignId}`})
    //console.log('getCampaignUsersData', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCampaignUsersData');
    console.error({error});
    throw error;
  }
}

export async function toggleAutomaticModeReq({officeId, automaticMode} : {officeId : string, automaticMode: boolean}): Promise<OfficeCampaignInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `campaigns/toggle-automatic-mode/${officeId}/${automaticMode}`})
    console.log('toggleAutomaticMode', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleAutomaticMode');
    console.error({error});
    throw error;
  }
}

export async function getOfficesGoalsResumeReq({ campaignId }: { campaignId: string }): Promise<{ offices: OfficeGoalsResumeType[]; customersCreated: number }> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `campaigns/offices-goals/${campaignId}` });
    const { error } = response;
    if (error == null) {
      return response.result;
    } else {
      throw error;
    }
  } catch (error) {
    console.error("ERROR ON getOfficesGoalsResumeReq");
    console.error({ error });
    throw error;
  }
}