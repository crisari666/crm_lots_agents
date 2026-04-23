import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { endSessionForceUserAction } from "../features/signin/signin.slice"
import { OmegaSoftConstants } from "./khas-web-constants"
import { store } from "./store"

const baseURL = (import.meta.env.VITE_URL_CUSTOMERS_MS as string | undefined)?.trim?.() ?? ""

export const customersMsAxios = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
})

/** Merge into request `headers` so admin routes always carry office JWT (same key as interceptor). */
export function customersMsAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  return token ? { token } : {}
}

customersMsAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  if (token) {
    config.headers.set("token", token)
  }
  return config
})

customersMsAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(endSessionForceUserAction())
      localStorage.removeItem(OmegaSoftConstants.localstorageAuthKey)
      localStorage.removeItem(OmegaSoftConstants.localstorageTokenKey)
    }
    return Promise.reject(error)
  }
)
