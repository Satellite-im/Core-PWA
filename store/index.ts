import SettingsMutations from './settings/mutations'
import AudioVideoMutations from './audio/mutations'
import UIMuatations from './ui/mutations'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
  ...UIMuatations,
}
