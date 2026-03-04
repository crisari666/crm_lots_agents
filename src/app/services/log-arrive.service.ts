import Api from "../axios";
import { QrLogArrive } from "../models/qr-log-arrive.type";

export async function generateQrForUserReq({userId, officeId} : {userId : string, officeId: string}): Promise<QrLogArrive | string>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `qr-log/generate`, data: {userId, officeId}})
    console.log('generateQrForUserReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON generateQrForUserReq');
    console.error({error});
    throw error;
  }
}