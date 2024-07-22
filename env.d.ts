/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_HASH: string
  readonly VITE_BUILD_HASH_SHORT: string
  readonly VITE_BUILD_DATE: string
  readonly VITE_BRANCH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}