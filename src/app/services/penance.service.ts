import Api from "../axios";

export async function addPenanceToUserReq({user, customer} : {user : string, customer: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `penances/user-customer-penance`, data: {user, customer}})
    console.log('addPenanceToUser', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addPenanceToUser');
    console.error({error});
    throw error;
  }
}

export async function getPenancesReq(): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `penances/get-not-charged-penances`})
    console.log('getPenances', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {

      throw error
    }
  } catch (error) {
    console.error('ERROR ON getPenances');
    console.error({error});
    throw error;
  }
}