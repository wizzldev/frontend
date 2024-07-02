import request from '@/scripts/request/request'

export const uploadFileToServer = async (event: Event, chatID: string) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length < 1) {
    return
  }

  const data = new FormData()
  data.append('file', files[0])
  const hookID = new Date().getTime().toString()

  return request.post(`/chat/${chatID}/file?hook_id=${hookID}`, data)
}