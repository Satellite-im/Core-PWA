import {
  ProfileBadgeType,
  ProfileBadge,
  ProfileInfo,
} from '~/types/profile/profile'

export const profileBadges = [
  {
    type: ProfileBadgeType.Type1,
    badge: { color: 'red', icon: ['fas', 'id-badge'] },
  },
  {
    type: ProfileBadgeType.Type2,
    badge: { color: 'blue', icon: ['fas', 'ribbon'] },
  },
  {
    type: ProfileBadgeType.Type3,
    badge: { color: 'green', icon: ['fas', 'certificate'] },
  },
  {
    type: ProfileBadgeType.Type4,
    badge: { color: 'yellow', icon: ['fas', 'otter'] },
  },
  {
    type: ProfileBadgeType.Type5,
    badge: { color: 'purple', icon: ['far', 'id-badge'] },
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
