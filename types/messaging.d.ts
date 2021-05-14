export type TextPayload = string

export type ImagePayload = {
  type: string
  url: string
}

export type Message = {
  id: string
  at: number
  type: string
  payload: TextPayload | ImagePayload
}

export type Group = {
  id: string
  at: number
  type: 'group' | 'divider'
  from: string
  to: string
  messages: Array<Message> | null
}

export type MessageGroup = Array<Group>
