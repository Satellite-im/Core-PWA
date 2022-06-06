import { GetterTree } from 'vuex'
import { extendedDayjs } from '~/plugins/local/dayjs'
import { RootState } from '~/types/store/store'
import { SettingsState } from '~/store/settings/types'

export interface SettingsGetters {
  /**
   * @description return localized timestamp
   * @argument {number} timestamp unix timestamp
   * @returns {string} formatted time
   * @example (23423424) => 2:49 PM
   */
  getTimestamp(state: SettingsState): (timestamp: number) => string
  /**
   * @description return localized timestamp, including date
   * @argument {number} timestamp unix timestamp
   * @returns {string} formatted time and date
   * @example (23423424) => 6/6/22 2:49 PM
   */
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
