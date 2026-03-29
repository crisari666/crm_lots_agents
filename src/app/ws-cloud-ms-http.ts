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

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const cleaned =
      params == null
        ? undefined
        : Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
          )
    const response: AxiosResponse<T> = await wsCloudMsAxios.get(path, { params: cleaned })
    return response.data
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await wsCloudMsAxios.post(path, data)
    return response.data
  }
}
