/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_VOIP_SERVER?: string
  readonly VITE_AGENT_BASE_URL?: string
  readonly VITE_SIGNUP_PUBLIC_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
