import type { User } from '@/types/user'

export interface AuthStore {
  user: User | undefined
  token: string | undefined
  checkTime: Date
}
