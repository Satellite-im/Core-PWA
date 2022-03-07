/**
 * This plugin enables persistent storage to the state.
 */

import { omit } from 'lodash'
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
  'chat/addFile',
]

// State properties path to blacklist saving to store
const commonProperties = [
  'webrtc.initialized',
  'textile.initialized',
  'accounts.initialized',
  'friends.all',
  'webrtc.activeStream',
  'webrtc.connectedPeer',
  'webrtc.incomingCall',
  'ui.replyChatbarContent',
  'ui.editMessage',
  'ui.isLoadingFileIndex',
  'chat.files',
]

const propertiesNoStorePin = [
  'accounts.pin',
  'accounts.mnemonic',
  'accounts.locked',
  'accounts.error',
  'accounts.loading',
  'accounts.registrationStatus',
  ...commonProperties,
]

export default ({ store }: { store: any }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    reducer: (state: any) => {
      let blackList = propertiesNoStorePin
      if (state.accounts.storePin && !state.accounts.locked) {
        blackList = commonProperties
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
