export enum AddFriendEnum {
  EMPTY = '',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  SENDING = 'sending',
  OPTIONS = 'options',
}

export type AddFriend = keyof typeof AddFriendEnum
