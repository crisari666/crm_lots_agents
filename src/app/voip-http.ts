import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { endSessionForceUserAction } from "../features/signin/signin.slice"
import { OmegaSoftConstants } from "./khas-web-constants"
import { store } from "./store"

function resolveVoipBaseUrl(): string {
  const raw = import.meta.env.VITE_URL_VOIP_SERVER?.trim() ?? ""
  if (!raw) {
    throw new Error("Falta VITE_URL_VOIP_SERVER en el entorno.")
  }
  return raw.replace(/\/$/, "")
}

export const voipAxios = axios.create({
  baseURL: resolveVoipBaseUrl(),
  headers: {
    "Content-type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
})

export function voipAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  return token ? { token } : {}
}

voipAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(OmegaSoftConstants.localstorageTokenKey)
  if (token) {
    config.headers.set("token", token)
  }
  return config
})

voipAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && error.config?.url?.includes("/token/")) {
      store.dispatch(endSessionForceUserAction())
      localStorage.removeItem(OmegaSoftConstants.localstorageAuthKey)
      localStorage.removeItem(OmegaSoftConstants.localstorageTokenKey)
    }
    return Promise.reject(error)
  }
)
