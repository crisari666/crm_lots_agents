import { FileUtils } from "../../utils/file.utils";
import Api from "../axios";
import { PrizeInterface } from "../models/prize-inteface";

export async function sendRafflePrizeReq({prize} : {prize: PrizeInterface}): Promise<PrizeInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `prizes/add-prize-to-raffle`, data: prize})
    const { error } = response
    if(error == null) {
      return response.result.raffle.prizes
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON sendRafflePrizeReq');
    console.error({error});
    throw error;
  }
}

export async function removeImgFromPrizeReq({prizeId, prizeImg} : {prizeId : string, prizeImg: string}): Promise<PrizeInterface>  {
  try {
    const api = Api.getInstance()
    const responseRemovePrizeImg = await api.delete({path: `prizes/delete-prize-image/${prizeId}/${prizeImg}`})
    console.log({responseRemovePrizeImg});
    const { error } = responseRemovePrizeImg
    if(error == null) {
      return responseRemovePrizeImg.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON removeImgFromPrizeReq');
    console.error({error});
    throw error;
  }
}

export async function uploadPrizeImagesReq({prizeId, files} : {prizeId : string, files: any}): Promise<any>  {
  try {
    const api = Api.getInstance()
    
    const filesFormat = await files.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("files", f)
    }
    const responseUploadPrizeImg = await api.post({path: `prizes/upload-prize-image/${prizeId}`, data: formData, isFormData: true})
    console.log({responseUploadPrizeImg});
    const { error } = responseUploadPrizeImg
    if(error == null) {
      return responseUploadPrizeImg.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadRaffleImages');
    console.error({error});
    throw error;
  }
}