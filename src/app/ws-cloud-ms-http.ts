import axios, { type AxiosResponse } from "axios"

const baseURL = (import.meta.env.VITE_URL_WS_CLOUD_MS as string)?.trim?.() ?? ""

const wsCloudMsAxios = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json"
  }
})

export class WsCloudMsHttp {
  private static instance: WsCloudMsHttp

  public static getInstance(): WsCloudMsHttp {
    if (!WsCloudMsHttp.instance) {
      WsCloudMsHttp.instance = new WsCloudMsHttp()
    }
    return WsCloudMsHttp.instance
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await wsCloudMsAxios.post(path, data)
    return response.data
  }
}
