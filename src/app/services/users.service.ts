import Api from "../axios"
import UserInterface from "../models/user-interface"

const api = new Api()

export type UserCreateRequestBody = {
  name: string
  lastName: string
  email: string
  phone: string
  level: number
  phoneJob?: string
  password?: string
  office?: string
  lead?: string
  percentage?: number
  document?: string
  city?: string
  subadmin?: string
}

export type UserUpdateRequestBody = {
  name: string
  lastName: string
  email: string
  phone: string
  level: number
  phoneJob: string
  office: string
  lead: string
  connected?: boolean
  percentage?: number
  enable?: boolean
  link?: string
  root?: boolean
  password?: string
  document: string
  city: string
  subadmin?: string
}

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

export async function sendUserService({
  user,
}: {
  user: UserCreateRequestBody
}): Promise<UserInterface> {
  const createUser = await api.post({ path: "users/create", data: user })
  const { error } = createUser
  if (error === null) {
    return createUser.result as UserInterface
  }
  throw new Error(typeof error === "string" ? error : "Create user failed")
}

export async function sendWelcomeAccessEmailReq(userId: string): Promise<boolean> {
  const res = await api.post({
    path: `users/${userId}/send-welcome-access-email`,
    data: {},
  })
  if (res == null) {
    throw new Error("Could not send welcome email")
  }
  const { error } = res as { error?: string | null }
  if (error != null && error !== "") {
    throw new Error(typeof error === "string" ? error : "Error")
  }
  return true
}

export async function updateUserService({
  user,
  userId,
}: {
  user: UserUpdateRequestBody
  userId: string
}): Promise<boolean | string> {
  const updateUser = await api.post({
    path: `users/update-user/${userId}`,
    data: user,
  })
  const { error } = updateUser
  if (error === null) {
    return updateUser.result as boolean | string
  }
  throw new Error(typeof error === "string" ? error : "Update user failed")
}

export async function getSubadminVentorsReq(subadminId: string): Promise<UserInterface[]> {
  const response = await api.get({ path: `users/subadmin/${subadminId}/ventors` })
  const { error } = response
  if (error == null) {
    return response.result as UserInterface[]
  }
  throw error
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

export async function getContentUsersReq(): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/content-users`})
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

export async function setAutoCustomerAssignmentDisabledReq({
  userId,
  autoCustomerAssignmentDisabled,
}: {
  userId: string
  autoCustomerAssignmentDisabled: boolean
}): Promise<UserInterface> {
  try {
    const api = Api.getInstance()
    const response = await api.put({
      path: `users/set-auto-customer-assignment-disabled/${userId}`,
      data: { autoCustomerAssignmentDisabled },
    })
    const { error } = response
    if (error == null) {
      return response.result as UserInterface
    }
    throw error
  } catch (error) {
    console.error('ERROR ON setAutoCustomerAssignmentDisabledReq')
    console.error({ error })
    throw error
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
    const response = await api.patch({
      path: `users/fcm-token`,
      data: { token: FCM, platform: 'web' },
    })
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