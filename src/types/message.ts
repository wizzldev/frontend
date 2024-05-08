import type { User } from '@/types/user'

export interface Message {
  id: number;
  sender: User;
  content: string;
  type: string;
  data_json: string;
}

export type Messages = Array<Message>;