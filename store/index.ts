import AccountsActions from './accounts/actions'
import AccountsMutations from './accounts/mutations'
import AudioVideoMutations from './audio/mutations'
import DataStateMutations from './dataState/mutations'
import FileActions from './files/actions'
import FileMutations from './files/mutations'
import FriendActions from './friends/actions'
import FriendsMutations from './friends/mutations'
import GroupsActions from './groups/actions'
// import GroupsGetters from './groups/getters'
import GroupsMutations from './groups/mutations'
import MediaActions from './media/actions'
import MediaMutations from './media/mutations'
import SearchMutations from './search/mutations'
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
  ...AccountsMutations,
  ...SearchMutations,
  ...GroupsMutations,
}

export const actions = {
  ...FileActions,
  ...FriendActions,
  ...MediaActions,
  ...AccountsActions,
  ...GroupsActions,
}

// export const getters = {
//   ...GroupsGetters,
// }
