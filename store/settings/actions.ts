import { SettingsError } from '~/store/settings/types'

// begin - firefox polyfill
if (window.indexedDB && typeof window.indexedDB.databases === 'undefined') {
  const LOCALSTORAGE_CACHE_KEY = 'indexedDBDatabases'

  // Store a key value map of databases
  const getFromStorage = () =>
    JSON.parse(window.localStorage[LOCALSTORAGE_CACHE_KEY] || '{}')

  // Write the database to local storage
  const writeToStorage = (value: any) =>
    (window.localStorage[LOCALSTORAGE_CACHE_KEY] = JSON.stringify(value))

  IDBFactory.prototype.databases = () =>
    Promise.resolve(
      Object.entries(getFromStorage()).reduce(
        (acc: { name: string; version: any }[], [name, version]) => {
          acc.push({ name, version })
          return acc
        },
        [],
      ),
    )

  // Intercept the existing open handler to write our DBs names
  // and versions to localStorage
  const open = IDBFactory.prototype.open

  IDBFactory.prototype.open = function (...args) {
    const dbName = args[0]
    const version = args[1] || 1
    const existing = getFromStorage()
    writeToStorage({ ...existing, [dbName]: version })
    return open.apply(this, args)
  }

  // Intercept the existing deleteDatabase handler remove our
  // dbNames from localStorage
  const deleteDatabase = IDBFactory.prototype.deleteDatabase

  IDBFactory.prototype.deleteDatabase = function (...args) {
    const dbName = args[0]
    const existing = getFromStorage()
    delete existing[dbName]
    writeToStorage(existing)
    return deleteDatabase.apply(this, args)
  }
}
// end polyfill

async function deleteIndexedDb() {
  const databases = await indexedDB.databases()
  Promise.all(
    databases.map(async (db) => {
      if (db.name) {
        indexedDB.deleteDatabase(db.name)
      }
    }),
  )
}

export default {
  async clearLocalStorage() {
    try {
      await deleteIndexedDb()
      localStorage.clear()
    } catch (e) {
      throw new Error(SettingsError.DATABASE_NOT_CLEARED)
    }
  },
}
