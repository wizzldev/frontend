import request from '@/scripts/request/request'
import { ref } from 'vue'

export const fetchInfo = async (id: string) => {
  const res = await request.get(`/chat/user/${id}`)
  if (!res?.data?.$error) {
    const data = res.data as {
      id: number
      name: string
      image_url: string
      is_private_message: boolean
      roles: Array<string>
      your_roles: Array<string>,
      custom_invite: string | null
      emoji: string | null
    }
    return {
      user: {
        id: data.id,
        name: data.name,
        image: data.image_url,
        isPrivateMessage: data.is_private_message,
        loading: false,
        is_verified: false,
        custom_invite: data.custom_invite,
        emoji: data.emoji || '✨'
      },
      roles: data.roles,
      your_roles: data.your_roles
    }
  }
  return { user: null, roles: null }
}

export const getChatProfileRef = () => {
  return ref({
    id: 0,
    name: '',
    image: '',
    isPrivateMessage: false,
    loading: true,
    is_verified: false,
    custom_invite: null as string | null,
    emoji: '✨',
  })
}