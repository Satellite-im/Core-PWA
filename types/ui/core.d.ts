export type UserState = 'online' | 'idle' | 'offline'

export type Badge = 'verified' | 'community' | 'cameraman'

export type User = {
  name: string
  address: string
  status: string
  state: UserState
  unreadCount: Number
  profilePicture: string
  badge?: Badge
}

export interface Friend extends User {
  item: any
  pending: Boolean
  activeChat: Boolean
}

export type Group = {
  name: string
  address: string
  motd: string
  members: Array<string>
  creator: string
}

export type Server = {
  name: string
  address: string
  desc: string
}
