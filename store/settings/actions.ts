import { db } from '~/plugins/thirdparty/dexie'
import { SettingsError } from '~/store/settings/types'

export default {
  async clearLocalStorage() {
    try {
      await db.delete()
      await localStorage.removeItem('Satellite-Store')
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
