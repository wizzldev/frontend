export interface Contact {
  id: number
  name: string
  image: string
  last_message: LastMessage
}

export interface LastMessage {
  sender_id: number
  sender_name: string
  content: string
  type: string
  date: string
}

export type Contacts = Array<Contact>
