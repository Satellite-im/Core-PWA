export interface GroupMember {
  name: string
  photoHash: string
  status: string
  address: string
  peerId?: string
}

export interface Group {
  id: string
  address: string
  name: string
  admin: string
  creator: string
  members: GroupMember[]
  addresses: string[]
  openInvites: boolean
  encryptionKey: string
  lastUpdate: number
}

export interface GroupsState {
  all: Group[]
  inviteSubscription: number | null
  groupSubscriptions: string[]
}

export enum GroupsError {
  INVITE_ALREADY_SENT = 'errors.groups.request_already_sent',
  RECIPIENT_NOT_FOUND = 'errors.groups.recipient_not_found',
  USER_NOT_INITIALIZED = 'errors.groups.user_not_initialized',
}
