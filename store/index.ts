import SettingsMutations from './settings/mutations'
import AudioVideoMutations from './audio/mutations'
import UIMuatations from './ui/mutations'
import FileMutations from './files/mutations'
import LoadingMutations from './loading/mutations'

import FileActions from './files/actions'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
  ...UIMuatations,
  ...FileMutations,
  ...LoadingMutations,
}

export const actions = {
  ...FileActions,
}
