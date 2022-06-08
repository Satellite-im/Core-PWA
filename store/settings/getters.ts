import { GetterTree } from 'vuex'
import { extendedDayjs } from '~/plugins/local/dayjs'
import { RootState } from '~/types/store/store'
import { SettingsState } from '~/store/settings/types'

export interface SettingsGetters {
  /**
   * @description return localized timestamp
   * @argument {number} time unix timestamp
   * @returns {string} formatted time
   * @example (23423424) => 2:49 PM
   * @example (23423424, full) => 6/6/22 2:49 PM
   */
  getTimestamp(
    state: SettingsState,
  ): ({ time, full }: { time: number; full?: boolean }) => string
}

const getters: GetterTree<SettingsState, RootState> & SettingsGetters = {
  getTimestamp:
    (state: SettingsState) =>
    ({ time, full }): string => {
      return extendedDayjs(time)
        .local()
        .tz(state.timezone)
        .format(full ? 'L LT' : 'LT')
    },
}

export default getters
