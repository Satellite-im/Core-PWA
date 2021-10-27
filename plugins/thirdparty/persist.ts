/**
 * This plugin enables persistant storage to the state.
 */

import { omit } from 'lodash'
import { VuexPersistence } from 'vuex-persist'

// Add mutations here to blacklist saving to store
const mutationsBlacklist = [
  'accounts/unlock',
  'accounts/setAccountError',
  'accounts/setPhrase',
  'files',
  'toggleIncomingCall',
  'ui/setMessages',
  'ui/sendMessage',
]

// State properties path to blacklist saving to store
const propertiesBlacklist = [
  'accounts.pin',
  'accounts.mnemonic',
  'accounts.locked',
  'accounts.error',
  'accounts.loading',
  'accounts.registrationStatus',
  'friends.all',
]

export default ({ store }: { store: any }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    reducer: (state: any) => {
      // Lodash omit is not so performant, but it's actually fine
      // for blacklisting the state to be persisted
      return omit(state, propertiesBlacklist)
    },
    filter: (mutation) => {
      // Allows blacklisting of data we don't want stored
      return !mutationsBlacklist.includes(mutation.type)
    },
    // restoreState: (key, storage) => {
    //   if (!storage) {
    //     return null
    //   }

    //   const stringifiedState = storage.getItem(key)

    //   if (!stringifiedState) {
    //     return null
    //   }

    //   const parsedState: RootState = JSON.parse(stringifiedState)

    //   return parsedState
    // },
    // saveState: (key, state, storage) => {},
  }).plugin(store)
}
