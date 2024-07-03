import type { FileDataJSON, FileInfo } from '@/types/file'
import request from '@/scripts/request/request'
import { md5 } from 'js-md5'

interface FileCacheData {
  info: FileDataJSON
  file: FileInfo
  isImage: boolean
}

export const fileCache = async (data: string | null = null): Promise<FileCacheData | null> => {
  if (data == null) return null

  const info = JSON.parse(data) as FileDataJSON

  const cacheID = cacheKey(info)
  const cache = window.localStorage.getItem(cacheID)
  if (cache) return JSON.parse(cache) as FileCacheData

  const res = await request.get(info.fetchFrom + '/info', {
    headers: {
      'X-File-Access-Token': info.accessToken
    }
  })
  if (res.data.$error) return null

  const file = res.data as FileInfo
  const isImage = file?.content_type.includes('image') || false

  const fileData = { info, file, isImage }

  window.localStorage.setItem(cacheID, JSON.stringify(fileData))

  return { info, file, isImage }
}

const cacheKey = (data: FileDataJSON): string => {
  return `__cache.file.${md5(data.fetchFrom)}${data.accessToken.substring(0, 5)}`
}
