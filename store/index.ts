import SettingsMutations from './settings/mutations'
import AudioVideoMutations from './audio/mutations'
import UIMuatations from './ui/mutations'
import FileMutations from './files/mutations'
import FriendsMutations from './friends/mutations'
import DataStateMutations from './dataState/mutations'

import FileActions from './files/actions'
import FriendActions from './friends/actions'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
  ...UIMuatations,
  ...FileMutations,
  ...FriendsMutations,
  ...DataStateMutations,
}

export const actions = {
  ...FileActions,
  ...FriendActions,
}
