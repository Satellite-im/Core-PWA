import { db } from '~/plugins/thirdparty/dexie'
import { SettingsError, SettingsState } from '~/store/settings/types'
import { ActionsArguments } from '~/types/store/store'

export default {
  async clearLocalStorage({ commit }: ActionsArguments<SettingsState>) {
    try {
      await db.delete()
      localStorage.clear()
      commit('removeAppState', true)
      location.reload()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
