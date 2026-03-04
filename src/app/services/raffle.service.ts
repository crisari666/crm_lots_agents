import { HandleRaffleForm } from "../../features/raffles/handle-raffle.state";
import { FileUtils } from "../../utils/file.utils";
import Api from "../axios";
import { RaffleInterface } from "../models/raffle-interface";

export async function sendRaffleHeadFormReq({raffleForm, raffleId} : {raffleForm : HandleRaffleForm, raffleId?: string}): Promise<RaffleInterface>  {
  try {
    const api = Api.getInstance()
    console.log({raffleForm});
    const {nTickets, ticketPrice} = raffleForm
    const response = await api.post({path: 'raffles/create-raffle', data: {...raffleForm, nTickets: Number(nTickets), ticketPrice: Number(ticketPrice)} })
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON sendRaffleHeadFormReq');
    console.error({error});
    throw error;
  }
}

export async function getRafflesReq(): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: 'raffles/get-raffles'})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getRafflesReq');
    console.error({error});
    throw error;
  }
}

export async function getRaffleByIdReq({raffleId} : {raffleId : string}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `raffles/get-raffle-by-id/${raffleId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getRaffleById');
    console.error({error});
    throw error;
  }
}

export async function uploadRaffleImagesReq({raffleId, files} : {raffleId : string, files: any}): Promise<any>  {
  try {
    const api = Api.getInstance()
    
    const filesFormat = await files.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("files", f)
    }
    const response = await api.post({path: `raffles/upload-raffle-image/${raffleId}`, data: formData, isFormData: true})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadRaffleImages');
    console.error({error});
    throw error;
  }
}

export async function removeImgFromRaffleReq({raffleId, raffleImg} : {raffleId : string, raffleImg: string}): Promise<RaffleInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.delete({path: `raffles/remove-file-from-raffle/${raffleId}/${raffleImg}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON removeImgFromRaffle');
    console.error({error});
    throw error;
  }
}