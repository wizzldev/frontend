export interface FileDataJSON {
  fetchFrom: string
  hasAccessToken: boolean
  accessToken: string
  justLoad: boolean
}

export interface FileInfo {
  name: string
  content_type: string
  size: number
}
