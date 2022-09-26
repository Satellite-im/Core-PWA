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
  'chat/addFile',
  'groups/setSubscriptionId',
  'video',
]

// State properties path to blacklist saving to store
const commonProperties = [
  'accounts.initialized',
  'friends.all',
  'friends',
  'webrtc.activeStream',
  'webrtc.incomingCall',
  'chat.replyChatbarMessage',
  'ui.editMessage',
  'chat.files',
  'chat.countError',
  'chat.activeUploadChats',
  'groups.inviteSubscription',
  'groups.groupSubscriptions',
  'ui.modals',
  'ui.isMobileNavVisible',
  'ui.settingsRoute',
  'conversation.participants',
  'files',
  'ui.callHeight',
  'accounts.phrase',
  'ui.quickProfile'
]

const propertiesNoStorePin = [
  'accounts.pin',
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
      if (state.settings.removeState) {
        return {}
      }
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
