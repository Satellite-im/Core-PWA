import SettingsMutations from './settings/mutations'
import AudioVideoMutations from './audio/mutations'

export const mutations = {
  ...SettingsMutations,
  ...AudioVideoMutations,
}
