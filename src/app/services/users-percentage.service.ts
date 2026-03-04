import { pushAlertAction } from "../../features/dashboard/dashboard.slice";
import { TypePercentageEnum, UserPercentageDialog } from "../../features/user-percentage/slice/users-percentage.state";
import Api from "../axios";
import { UserPercentageType } from "../models/user-percentage.type";
import { store } from "../store";


export async function getUserPercentagesReq(): Promise<UserPercentageType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `calculator/get-users-percentage`})
    //console.log('us', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON us');
    console.error({error});
    throw error;
  }
}

export async function addUserPercentageReq(data : UserPercentageDialog): Promise<UserPercentageType | undefined>{
  try {
    const api = Api.getInstance()
    const payload = {
      user: data.user,
      percentage: data.percentage,
      typePercentage: data.type
    }
    const response = await api.post({path: `calculator/add-user-percentage`, data: payload})

    //console.log('addUserPercentage', {response});
    if(response === undefined) return undefined
    const { error } = response
    if(error == null ) {
      return response.result
    }else {
      store.dispatch(pushAlertAction({message: response.error, type: 'error', title: "Error"}))
      return undefined
    }
  } catch (error) {
    console.error('ERROR ON addUserPercentage');
    console.error({error});
    throw error;
  }
}

export async function filterPercentagesReq({type} : {type : TypePercentageEnum}): Promise<UserPercentageType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `calculator/filter-percentages`, data: {type}})
    //console.log('filterPercentagesReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON filterPercentagesReq');
    console.error({error});
    throw error;
  }
}