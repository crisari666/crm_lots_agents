import Api from "../axios"

const api = new Api()

export async function addCapitalContributeReq({value, name} : {value: number, name: string})  {
  try {
    const addCapitalRes = await api.post({path: "capital-contribute/add-capital-contribute", data: {value: Number(value), name}})
    console.log({addCapitalRes});
    const { error } = addCapitalRes
    if(error == null){
      return addCapitalRes.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON METHOD_NAME');
    console.error({error});
    throw error;
  }
}

export async function getCapitalContributeByDateReq({date} : {date: string})  {
  try {
    const getCapital = await api.get({path: `capital-contribute/get-capital-by-date/${date}`})
    const { error } = getCapital
    if(error == null){
      return getCapital.result
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON METHOD_NAME');
    console.error({error});
    throw error;
  }
}
