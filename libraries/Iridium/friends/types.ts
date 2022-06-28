export type User = {
  did: string
  peerId?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  seen?: number
  name?: string
  photoHash?: string
}

export type Friend = User & {}

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected'
export type FriendRequest = {
  user: User
  incoming: boolean
  status: FriendRequestStatus
  at: number
}
