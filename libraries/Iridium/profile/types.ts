export type Profile = User & {
  friends: Friend[]
  chats: Chat[]
  groups: Group[]
  notifications: Notification[]
  settings: IridiumDocument
}
