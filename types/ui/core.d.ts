export type UserState = 'online' | 'idle' | 'offline'

export type Badge = 'verified' | 'community' | 'cameraman'

export type User = {
  name: string
  address: string
  status: string
  state: UserState
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
}

export type Server = {
  name: string
  address: string
  desc: string
}
