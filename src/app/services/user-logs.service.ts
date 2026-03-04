import Api from "../axios"
import { UserArriveLogType } from "../models/user-arrive-log.type"
import { UserLoginLogInterface } from "../models/user-login-log.interface"
import { UserTimeArriveType } from "../models/user-time-arrive.type"

export async function getLoginUserLogsReq({userId, end, start} : {userId: string, end: string, start: string}): Promise<UserLoginLogInterface[]> {
  try {
    const api = Api.getInstance()
    const getLogs = await api.get({ path: `users/userLogs/${userId}/${start}/${end}` })
    const { error } = getLogs
    if (error == null) {
      const { result } = getLogs
      return result
    } else {
      throw error
    }
  } catch (error) {
    console.error({ error })
    throw error
  }
}

export async function updateUserTimeArriveReq({userId, time} : {userId : string, time: number}): Promise<UserTimeArriveType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `qr-log/update-user-arrive-time/user/${userId}/time/${time}`})
    console.log('updateUserTimeArrive', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateUserTimeArrive');
    console.error({error});
    throw error;
  }
}

export async function getUserArrieTimeReq({userId} : {userId : string}): Promise<UserTimeArriveType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `qr-log/user-arrive-time/user/${userId}`})
    console.log('getUserArrieTime', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserArrieTime');
    console.error({error});
    throw error;
  }
}

export async function getArriveForUsersAndDateReq({users, date} : {users : string[], date: string}): Promise<{[user: string]: UserArriveLogType}>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `qr-log/get-users-logs-by-date`, data: {date, users}})
    console.log('getArriveForUsersAndDate', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getArriveForUsersAndDate');
    console.error({error});
    throw error;
  }
}
