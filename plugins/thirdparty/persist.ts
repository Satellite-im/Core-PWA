/**
 * This plugin enables persistent storage to the state.
 */

import { omit, remove } from 'lodash'
import { VuexPersistence } from 'vuex-persist'

// Add mutations here to blacklist saving to store
const mutationsBlacklist = [
  'accounts/unlock',
  'accounts/setAccountError',
  'accounts/setPhrase',
  'files',
  'toggleMediaIncomingCall',
  'ui/setMessages',
  'ui/sendMessage',
  'ui/setReplyChatbarContent',
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
  'prerequisites',
  'webrtc.activeStream',
]

const propertiesBlacklistWhenStorePin = [
  'friends.all',
  'prerequisites',
  'webrtc.activeStream',
]
export default ({ store }: { store: any }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    reducer: (state: any) => {
      let blackList = propertiesBlacklist
      if (state.accounts.storePin && !state.accounts.locked) {
        blackList = propertiesBlacklistWhenStorePin
      }
      // Lodash omit is not so performant, but it's actually fine
      // for blacklisting the state to be persisted
      return omit(state, blackList)
    },
    filter: (mutation) => {
      // Allows blacklisting of data we don't want stored
      return !mutationsBlacklist.includes(mutation.type)
    },
  }).plugin(store)
}
