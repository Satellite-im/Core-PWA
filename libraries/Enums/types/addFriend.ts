export enum AddFriendEnum {
  EMPTY = '',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  SENDING = 'sending',
  OPTIONS = 'options',
  REMOVE = 'remove',
}

export type AddFriend = keyof typeof AddFriendEnum
