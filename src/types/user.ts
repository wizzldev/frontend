export interface User {
  id: number
  first_name: string
  last_name: string
  image_url: string
  email: string
  is_bot: boolean
  is_verified: boolean
  enable_ip_check: boolean
  is_online: boolean
  nick_name?: string
}