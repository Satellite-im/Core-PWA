import { GetterTree } from 'vuex'
import { extendedDayjs } from '~/plugins/local/dayjs'
import { RootState } from '~/types/store/store'
import { SettingsState } from '~/store/settings/types'

export interface SettingsGetters {
  getTimestamp(state: SettingsState): (timestamp: number) => string
  getFullTimestamp(state: SettingsState): (timestamp: number) => string
}

const getters: GetterTree<SettingsState, RootState> & SettingsGetters = {
  getTimestamp:
    (state: SettingsState) =>
    (timestamp: number): string => {
      return extendedDayjs(timestamp).local().tz(state.timezone).format('LT')
    },
  getFullTimestamp:
    (state: SettingsState) =>
    (timestamp: number): string => {
      return extendedDayjs(timestamp).local().tz(state.timezone).format('L LT')
    },
}

export default getters
