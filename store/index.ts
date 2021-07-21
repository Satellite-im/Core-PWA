import AudioVideoMutations from './audio/mutations'
import DataStateMutations from './dataState/mutations'
import FileActions from './files/actions'
import FileMutations from './files/mutations'
import FriendActions from './friends/actions'
import FriendsMutations from './friends/mutations'
import MediaActions from './media/actions'
import MediaMutations from './media/mutations'
import SettingsMutations from './settings/mutations'
import UIMuatations from './ui/mutations'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
  ...UIMuatations,
  ...FileMutations,
  ...FriendsMutations,
  ...DataStateMutations,
  ...MediaMutations,
}

export const actions = {
  ...FileActions,
  ...FriendActions,
  ...MediaActions,
}
