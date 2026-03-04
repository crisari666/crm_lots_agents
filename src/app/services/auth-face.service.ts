import { UserAuthFaceType } from "../../features/auth-face/auth-face.state";
import Api from "../axios";
import { UserDocType } from "../models/user-doc.type";

export async function setAuthFaceReq({descriptor} : {descriptor : Float32Array}): Promise<UserAuthFaceType>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `auth-face/set-face-auth`, data: {descriptor, userId: ""}})
    console.log('authFace', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON authFace');
    console.error({error});
    throw error;
  }
}

export async function getAuthFaceReq({userId} : {userId : string}): Promise<UserAuthFaceType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `auth-face/get-face-auth/${userId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON authFace');
    console.error({error});
    throw error;
  }
}

export async function uploadFaceAuthReq({descriptor, image} : {descriptor : Float32Array, image: any}): Promise<{userDocs: UserDocType}>{
  try {
    
    const api = Api.getInstance()
    const formData = new FormData()
    formData.append("image", image)
    formData.append("descriptor", descriptor.toString())
    const response = await api.post({path: `auth-face/upload-face-auth`, data: formData, isFormData: true})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadFaceAuth');
    console.error({error});
    throw error;
  }
}

export async function logFaceAuthReq({userId, lat, lng} : {userId: string, lat: number, lng : number}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `auth-face/log-face-auth`, data: {userId, lat, lng}})
    console.log('logFaceAuthReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON logFaceAuthReq');
    console.error({error});
    throw error;
  }
}