import { Dexie } from 'dexie'
import { SettingsError } from '~/store/settings/types'

async function deleteAllDexieDbs() {
  const databases = await Dexie.getDatabaseNames()

  databases.forEach((name) => {
    new Dexie(name).delete()
  })
}

export default {
  async clearLocalStorage() {
    try {
      await deleteAllDexieDbs()
      localStorage.clear()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
