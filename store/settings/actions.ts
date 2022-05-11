import { Dexie } from 'dexie'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import { SettingsError } from '~/store/settings/types'
import { Config } from '~/config'

export default {
  async clearLocalStorage() {
    try {
      if (await Dexie.exists(Config.indexedDbName)) {
        await db.delete()
      }
      localStorage.clear()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
