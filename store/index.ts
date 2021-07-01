import SettingsMutations from './settings/mutations'
import AudioVideoMutations from './audio/mutations'
import UIMuatations from './ui/mutations'
import FileMutations from './files/mutations'
import FriendsMutations from './friends/mutations'
import LoadingMutations from './loading/mutations'

import FileActions from './files/actions'
import FriendActions from './friends/actions'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
  ...UIMuatations,
  ...FileMutations,
  ...LoadingMutations,
  ...FriendsMutations,
}

export const actions = {
  ...FileActions,
  ...FriendActions,
}
