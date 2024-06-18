import type { Message, MessageGroupList, Messages } from '@/types/message'
import { isEmoji } from '@/components/Chat/emoji'

export const messageSorter = (messages: Messages, authUserId: number): MessageGroupList => {
  const data = [] as MessageGroupList
  let mustUseNext = false

  if(messages?.length < 1) return data

  for(let i = 0; i < messages.length; i++) {
    // current message
    const message = messages[i]
    const messageType = getType(message)
    if(isEmoji(message.content)) {
      message.type = 'emoji'
      mustUseNext = true
    }
    // append the first message
    if(data.length == 0) {
      data.push({
        type: messageType,
        sender: message.sender,
        messages: [message],
      })
      continue
    }

    const latest = latestMessage(data)

    if(isDateTagRequired(new Date(latest.created_at), new Date(message.created_at))) {
      data.push({
        type: 'info',
        sender: message.sender,
        messages: [getDateTimeMessage(message)],
      })
      data.push({
        type: messageType,
        sender: message.sender,
        messages: [message]
      })
      continue
    }

    if(!mustUseNext && latest.sender.id == message.sender.id && isLatestMessageLengthOK(data, authUserId) && getType(latest) == messageType) {
      data[data.length - 1].messages.push(message)
      continue
    }

    mustUseNext = false

    data.push({
      type: messageType,
      sender: message.sender,
      messages: [message],
    })
  }

  return data
}

const getType = (m: Message): string => {
  if(['message', 'file:file', 'file:image'].includes(m.type)) return 'message'
  return 'info'
}

const latestMessage = (group: MessageGroupList): Message => {
  const g = group[group.length - 1]
  return g.messages[g.messages.length - 1]
}

const isLatestMessageLengthOK = (group: MessageGroupList, authUserId: number): boolean => {
  const g = group[group.length - 1]
  if(g.sender.id == authUserId) return true
  return g.messages.length <= 5
}

const isDateTagRequired = (d1: Date, d2: Date): boolean => {
  const hours = Math.abs(d1.getTime() - d2.getTime()) / 36e5;
  console.log(hours)
  return hours > 1
}

const getDateTimeMessage = (m: Message): Message => {
  return {
    id: -1,
    sender: m.sender,
    content: '',
    type: 'date-time',
    data_json: null,
    reply: undefined,
    created_at: m.created_at,
    updated_at: m.updated_at,
    likes: [],
    underSending: false,
    hookId: ''
  }
}
