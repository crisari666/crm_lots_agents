import { AxiosError, AxiosResponse } from "axios"
import axios from "axios"
import { OmegaSoftConstants } from "./khas-web-constants"
import { store } from "./store"
import { endSessionForceUserAction } from "../features/signin/signin.slice"
const urlApi = import.meta.env.VITE_API_URL
const urlRagAgent = import.meta.env.VITE_URL_RAG_AGENT
const apiAxios = axios.create({
  baseURL: urlApi,
  headers: {
    "Content-type": "application/json",
  },
})
const ragApiAxios = axios.create({
  baseURL: urlRagAgent,
  headers: {
    "Content-type": "application/json",
  },
})

export default class Api {
  private static instance: Api;
  
  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api()
    }
    return Api.instance;
  }

  async get({ path, data, body }: { path: string; data?: object, body?: object }) {
    const token = await this.getToken()
    //console.log({ token })
    const headers = { token: token! }
    try {
      const responseGet: AxiosResponse = await apiAxios.get(path, {
        params: data,
        data: body,
        headers,
      })
      return responseGet.data
    } catch (error) {
      const e = error as AxiosError
      if (
        e.response?.status === 401 &&
        e.response?.data !== undefined &&
        e.response?.data !== undefined
      ) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
    }
  }

  async post({ path, data, isFormData = false }: { path: string; data: any, isFormData?: boolean}) {
    try {
      const token = await this.getToken()
      
      const headers = { token: token!, "Content-type": isFormData ? "multipart/form-data" : "application/json"}
      const responsePost: AxiosResponse = await apiAxios.post(path, data, {
        headers,
      })
      //console.log({responsePost});
      return await responsePost.data
    } catch (error) {
      const e = error as AxiosError
      if (
        e.response?.status === 401 &&
        e.response?.data !== undefined &&
        e.response?.data !== undefined
      ) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
    }
  }
 
  async patch({ path, data= {}, isFormData = false }: { path: string; data?: any, isFormData?: boolean}) {
    try {
      const token = await this.getToken()
      const urlApi = import.meta.env.VITE_API_URL
      
      const headers = { token: token!, "Content-type": isFormData ? "multipart/form-data" : "application/json"}
      const responsePost: AxiosResponse = await apiAxios.patch(path, data, {
        headers,
      })
      //console.log({responsePost});
      return await responsePost.data
    } catch (error) {
      const e = error as AxiosError
      if (
        e.response?.status === 401 &&
        e.response?.data !== undefined &&
        e.response?.data !== undefined
      ) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
    }
  }

  async put({ path, data = {} }: { path: string; data?: object }) {
    try {
      const token = await this.getToken()
      const headers = { token: token! }
      const responsePut: AxiosResponse = await apiAxios.put(path, data, {
        headers,
      })
      //console.log({responsePut});
      return await responsePut.data
    } catch (error) {
      const e = error as AxiosError
      if (
        e.response?.status === 401 &&
        e.response?.data !== undefined &&
        e.response?.data !== undefined
      ) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem(OmegaSoftConstants.localstorageAuthKey)
        }
      }
    }
  }

  async delete({ path, data }: { path: string; data?: object }) {
    try {
      const token = await this.getToken()
      const headers = { token: token! }
      const responseDelete: AxiosResponse = await apiAxios.delete(path, {
        data: data,
        headers,
      })
      //console.log({responseDelete});
      return await responseDelete.data
    } catch (error) {
      const e = error as AxiosError
      if (
        e.response?.status === 401 &&
        e.response?.data !== undefined &&
        e.response?.data !== undefined
      ) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem(OmegaSoftConstants.localstorageAuthKey)
        }
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  }
}

export class RagApi {
  private static instance: RagApi

  public static getInstance(): RagApi {
    if (!RagApi.instance) {
      RagApi.instance = new RagApi()
    }
    return RagApi.instance
  }

  async get({ path, data, body }: { path: string; data?: object; body?: object }) {
    const token = this.getToken()
    try {
      const responseGet: AxiosResponse = await ragApiAxios.get(path, {
        params: data,
        data: body,
        headers: { token: token! },
      })
      return responseGet.data
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401 && e.response?.data !== undefined) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
      throw error
    }
  }

  async post({ path, data, isFormData = false }: { path: string; data: any; isFormData?: boolean }) {
    const token = this.getToken()
    const headers = { token: token!, "Content-type": isFormData ? "multipart/form-data" : "application/json" }
    try {
      const responsePost: AxiosResponse = await ragApiAxios.post(path, data, { headers })
      return await responsePost.data
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401 && e.response?.data !== undefined) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
      throw error
    }
  }

  async patch({ path, data = {}, isFormData = false }: { path: string; data?: any; isFormData?: boolean }) {
    const token = this.getToken()
    const headers = { token: token!, "Content-type": isFormData ? "multipart/form-data" : "application/json" }
    try {
      const responsePatch: AxiosResponse = await ragApiAxios.patch(path, data, { headers })
      return await responsePatch.data
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401 && e.response?.data !== undefined) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
      throw error
    }
  }

  async delete({ path, data }: { path: string; data?: object }) {
    const token = this.getToken()
    try {
      const responseDelete: AxiosResponse = await ragApiAxios.delete(path, { data, headers: { token: token! } })
      return await responseDelete.data
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401 && e.response?.data !== undefined) {
        const data: any = e.response?.data
        if (data.error != null && data.error === "Unauthorized") {
          store.dispatch(endSessionForceUserAction())
          localStorage.removeItem("auth")
        }
      }
      throw error
    }
  }

  getToken(): string | null {
    return localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  }
}
