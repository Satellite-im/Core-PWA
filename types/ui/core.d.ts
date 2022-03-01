export type Group = {
  name: string
  address: string
  motd: string
  members: Array<string>
  creator: string
  encryptionKey: string
}

export type Server = {
  name: string
  address: string
  desc: string
}

export type Realm = {
  id: string
  nickname: string
  disabled: boolean
}
