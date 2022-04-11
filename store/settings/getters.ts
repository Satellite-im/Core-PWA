import { SettingsState } from './types'

const getters = {
  getTimezone: (state: SettingsState): string => {
    return state.timezone
  },
}

export default getters
