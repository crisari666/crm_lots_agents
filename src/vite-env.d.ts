/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_VOIP_SERVER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
