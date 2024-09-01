import type { Messages } from '@/types/message'
import type { ThemeData } from '@/types/theme'

export interface ChatStorage {
  isPM: Record<string, boolean>
  messages: Record<string, Messages>
  roles: Record<string, Array<string> | null>
  profile: Record<
    string,
    {
      name: string
      pm: boolean
      image: string
      loading: boolean
      is_verified: boolean
      emoji: string
    }
  >
  lastFetch: Record<string, Date>
  theme: Record<string, ThemeData | undefined>
  cursors: Record<string, { nextCursor: string; prevCursor: string }>
}
