import { FileUtils } from "../../utils/file.utils"
import Api from "../axios"
import { LeadWithUsersInterface } from "../models/lead-with-user.interface"
import { UserDocType } from "../models/user-doc.type"
import UserInterface from "../models/user-interface"

const api = new Api()

export async function fetchUsers({enable = false} : {enable?: boolean}): Promise<any> {
  try {
    const path = !enable ? "users" : "users/enables"
    const getUsers = await api.get({ path })
    const { error } = getUsers
    if (error == null) {
      const { result } = getUsers
      return result as UserInterface[]
    } else {
      throw error
    }
  } catch (error) {
    console.error({ error })
  }
}

export async function fetchSubadmins(): Promise<any> {
  try {
    const getSubadmins = await api.get({ path: "users/subadmins" })
    const { error } = getSubadmins
    if (error == null) {
      const { result } = getSubadmins
      return result as UserInterface[]
    } else {
      throw error
    }
  } catch (error) {
    console.error({ error })
  }
}

export async function getUserByIdReq(userId: string): Promise<any> {
  try {
    const fetchUser = await api.get({ path: `users/byId/${userId}` })
    const { error } = fetchUser
    if (error == null) {
      const { result } = fetchUser
      return result
    } else {
      throw error
    }
  } catch (error) {
    console.error({ error })
  }
}

export async function sendUserService({user}: { user: any }): Promise<UserInterface | undefined> {
  try {
    const createUser = await api.post({ path: "users/create", data: user })
    const {error} = createUser
    if(error === null){
      return createUser.result
    }else {
      throw error
    }
  } catch (error) {
    console.error({error});
  }
}

export async function updateUserService({user, userId}:{user:UserInterface, userId: string}) {
  try {
    const updateUser = await api.post({path: `users/update-user/${userId}`, data: user})
    //console.log({updateUser});
    
    const {error} = updateUser
    if(error === null){
      return updateUser.result
    }else {
      throw error
    }
  } catch (error) {
    console.error({error});
    
  }
}

export async function siginReq({user, lat, lng, password} : {user: string, password: string, lat: number, lng: number}): Promise<boolean | UserInterface | undefined> {
  try {
    const signinRequest = await api.post({path: "login/signin", data: {user, password, lat, lng}})
    const {error} = signinRequest
    if(error == null){
      const { result } = signinRequest
      return result
    }else {
      throw error
    }
  } catch (error) {
    console.error({error});
  }
}

export async function getDebtCollectorsReq({customerId} : {customerId: string}): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/debt-collectors/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getDebtCollectorsReq');
    console.error({error});
    throw error;
  }
}

export async function updateUserOfficeReq({userId, officeId, lead} : {userId : string, officeId: string, lead: string}): Promise<UserInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `users/${userId}/update-office`, data: {office: officeId, lead}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateUserOffice');
    console.error({error});
    throw error;
  }
}

export async function getLeadForOfficeReq({officeId} : {officeId : string}): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/leads/${officeId}`})
    //console.log('getLeadForOffice', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getLeadForOffice');
    console.error({error});
    throw error;
  }
}

export async function getOnlyLeadsReq(): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/leads`})
    //console.log('getOnlyLeads', {response});
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

export async function getAssignersReq(): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/assigners`})
    //console.log('getAssigners', {response});
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

export async function getLeadUsersReq(): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/lead-users`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getLeadUsersReq');
    console.error({error});
    throw error;
  }
}

export async function getLeadsWithUsers(): Promise<LeadWithUsersInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/leads-with-users`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getLeadWithUsers');
    console.error({error});
    throw error;
  }
}

export async function toggleEnableUserReq({userId, enable} : {userId : string, enable: boolean}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/toggle-enable-user/${userId}/${enable}`})
    console.log('toggleEnableUserReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON toggleEnableUserReq');
    console.error({error});
    throw error;
  }
}

export async function setUserLinkReq({userId, link} : {userId : string, link: string}): Promise<UserInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.put({path: `users/set-user-link/${userId}`, data: {link}})
    console.log('setUserLinkReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setUserLinkReq');
    console.error({error});
    throw error;
  }
}

export async function setUserPhysicalReq({
  userId,
  physical
}: {
  userId: string
  physical: boolean
}): Promise<UserInterface> {
  try {
    const api = Api.getInstance()
    const response = await api.put({
      path: `users/set-user-physical/${userId}`,
      data: { physical }
    })
    const { error } = response
    if (error == null) {
      return response.result as UserInterface
    }
    throw error
  } catch (error) {
    console.error('ERROR ON setUserPhysicalReq')
    console.error({ error })
    throw error
  }
}

export async function uploadUserDocReq({documentType, file, userId} : {userId: string, documentType: string, file: any}): Promise<UserDocType>{
  try {
    const api = Api.getInstance()
    const filesFormat = await file.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
    const formData = new FormData()
    formData.append("file", filesFormatted[0])
    const response = await api.post({path: `users/user-document/${userId}/${documentType}`, data: formData, isFormData: true})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadUserDocReq');
    console.error({error});
    throw error;
  }
}

export async function getUserDocsReq({userId} : {userId : string}): Promise<UserDocType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/get-user-docs/${userId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserDocsReq');
    console.error({error});
    throw error;
  }
}

export async function closeUserMobileSesionReq({userId} : {userId : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `login/close-mobile-session/${userId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON closeUserMobileSesion');
    console.error({error});
    throw error;
  }
}

export async function setUserLeaveDateReq({userId, leaveDate} : {userId : string, leaveDate: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `users/leave-date/${userId}/${leaveDate}`})
    console.log('stUserLeaveDate', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON stUserLeaveDate');
    console.error({error});
    throw error;
  }
}

export async function setUserGoalReq({userId, goal} : {userId : string, goal: number}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `users/user-goal/${userId}/${goal}`})
    console.log('stUserLeaveDate', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON stUserLeaveDate');
    console.error({error});
    throw error;
  }
}

export async function updateFcmTokenForUserReq({FCM} : {FCM : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `users/set-fcm-token/${FCM}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateFcmTokenForUser');
    console.error({error});
    throw error;
  }
}

export type UserImportRowPayload = {
  name: string
  lastName: string
  phone: string
  email: string
}

/** Matches `POST /users/import` — see omega_office_back `md_files/USERS-IMPORT-API.md` */
export type UserImportFirstStepType =
  | "scheduled_whatsapp_import_greeting"
  | "immediate_whatsapp_import_sequence"
  | "voice_call"

export type UserImportResultItem = {
  email: string
  status: 'created' | 'already_exists'
  userId?: string
}

export async function importUsersReq({
  importFirstStep,
  users
}: {
  importFirstStep: UserImportFirstStepType
  users: UserImportRowPayload[]
}): Promise<UserImportResultItem[] | undefined> {
  try {
    const api = Api.getInstance()
    const response = await api.post({
      path: 'users/import',
      data: { importFirstStep, users }
    })
    const { error } = response
    if (error == null) {
      return response.result as UserImportResultItem[]
    }
    throw error
  } catch (error) {
    console.error('ERROR ON importUsersReq')
    console.error({ error })
    throw error
  }
}