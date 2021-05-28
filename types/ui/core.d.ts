export type UserState = 'online' | 'idle' | 'offline'

export type User = {
  name: string
  address: string
  status: string
  state: UserState
}

export type Group = {
  name: string
  address: string
  motd: string
}
