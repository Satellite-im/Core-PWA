export type User = {
  id: string
  name?: string
  photoHash?: string
}

export type Friend = User & {
  peerId?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  seen?: number
}

export type FriendRequest = {
  user: User
  incoming: boolean
  state: 'pending' | 'accepted' | 'rejected'
  at: number
}
