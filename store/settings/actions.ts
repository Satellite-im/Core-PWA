import { SettingsError, SettingsState } from '~/store/settings/types'
import { ActionsArguments } from '~/types/store/store'

export default {
  async clearLocalStorage({
    commit,
    dispatch,
  }: ActionsArguments<SettingsState>) {
    try {
      dispatch('worker/postMessage', { type: 'db/clear' }, { root: true })
      localStorage.clear()
      commit('removeAppState', true)
      location.reload()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
