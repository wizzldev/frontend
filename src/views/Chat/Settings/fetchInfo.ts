import request from '@/scripts/request/request'

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
      },
      roles: data.roles,
      your_roles: data.your_roles
    }
  }
  return { user: null, roles: null }
}
