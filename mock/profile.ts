import {
  ProfileBadgeType,
  ProfileBadge,
  ProfileInfo,
} from '~/types/profile/profile'

export const profileBadges = [
  {
    type: ProfileBadgeType.Type1,
    imageUrl: require('~/assets/img/icon_badge1.svg'),
  },
  {
    type: ProfileBadgeType.Type2,
    imageUrl: require('~/assets/img/icon_badge2.svg'),
  },
  {
    type: ProfileBadgeType.Type3,
    imageUrl: require('~/assets/img/icon_badge3.svg'),
  },
  {
    type: ProfileBadgeType.Type4,
    imageUrl: require('~/assets/img/icon_badge4.svg'),
  },
  {
    type: ProfileBadgeType.Type5,
    imageUrl: require('~/assets/img/icon_badge5.svg'),
  },
] as ProfileBadge[]

export const sampleProfileInfo = {
  imageUrl: require('~/assets/img/profile.png'),
  badges: profileBadges,
  locations: [
    'New York, United States',
    'California, United States',
  ] as string[],
  languages: ['English', 'Spanish', 'German'] as string[],
  username: 'username01234#0001',
  status: 'Some super interesting status message.',
  identifier: '5e8a98e2-7060-4781-a33f-ca526796aab1',
} as ProfileInfo

export const recommendLocations = [
  { location: 'New York, United States', lat: 0, lng: 0 },
  { location: 'California, United States', lat: 0, lng: 0 },
  { location: 'Texas, United States', lat: 0, lng: 0 },
]
