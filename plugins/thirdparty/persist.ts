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
  'textile/setMessageLoading',
  'groups/setSubscriptionId',
]

// State properties path to blacklist saving to store
const commonProperties = [
  'webrtc.initialized',
  'textile.initialized',
  'textile.messageLoading',
  'accounts.initialized',
  'friends.all',
  'webrtc.activeStream',
  'webrtc.incomingCall',
  'ui.replyChatbarContent',
  'ui.editMessage',
  'chat.files',
  'groups.inviteSubscription',
  'groups.groupSubscriptions',
  'ui.modals',
  'ui.isScrollOver',
  'ui.filePreview',
  'ui.filesUploadStatus',
  'ui.fileDownloadList',
  'textile.userThread',
  'chat.uploadProgress',
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
