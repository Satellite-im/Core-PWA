export enum ProfileBadgeType {
  Type1 = 'badge1',
  Type2 = 'badge2',
  Type3 = 'badge3',
  Type4 = 'badge4',
  Type5 = 'badge5',
}

export type ProfileBadge = {
  type: ProfileBadgeType
  imageUrl: string
}

export type ProfileInfo = {
  imageUrl: string
  badges: ProfileBadge[]
  locations: string[]
  languages: string[]
  username: string
  status: string
  identifier: string
}
