export type TextPayload = string

export type ImagePayload = {
  type: string
  url: string
}

export type Reaction = {
  emoji: string
  reactors: string[]
  showReactors: boolean
}

export type Reply = {
  id: string
  at: number
  to: string
  from: string
  type: string
  payload: TextPayload | ImagePayload
  reactions: Array<Reaction>
}

export type Message = {
  id: string
  at: number
  type: string
  payload: TextPayload | ImagePayload
  replies: Array<Reply>
  reactions: Array<Reaction>
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
