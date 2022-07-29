import getters from './getters'
import { RootState } from '~/types/store/store'

import InitialAccountsState from '~/store/accounts/state'
import InitialAudioState from '~/store/audio/state'
import InitialChatState from '~/store/chat/state'
import InitialDataState from '~/store/dataState/state'
import InitialFilesState from '~/store/files/state'
import InitialFriendsState from '~/store/friends/state'
import InitialGroupsState from '~/store/groups/state'
import InitialMediaState from '~/store/media/state'
import InitialMetaState from '~/store/meta/state'
import InitialSettingsState from '~/store/settings/state'
import InitialSoundsState from '~/store/sounds/state'
import InitialTextileState from '~/store/textile/state'
import InitialUiState from '~/store/ui/state'
import InitialVideoState from '~/store/video/state'

export const initialRootState: RootState = {
  accounts: {
    ...InitialAccountsState(),
  },
  audio: {
    ...InitialAudioState(),
  },
  chat: {
    ...InitialChatState(),
  },
  dataState: {
    ...InitialDataState(),
  },
  files: {
    ...InitialFilesState(),
  },
  friends: {
    ...InitialFriendsState(),
  },
  groups: {
    ...InitialGroupsState(),
  },
  meta: {
    ...InitialMetaState(),
  },
  media: {
    ...InitialMediaState(),
  },
  settings: {
    ...InitialSettingsState(),
  },
  sounds: {
    ...InitialSoundsState(),
  },
  textile: {
    ...InitialTextileState(),
  },
  ui: {
    ...InitialUiState(),
  },
  video: {
    ...InitialVideoState(),
  },
}

describe('prerequisites returns', () => {
  test('still initializing', () => {
    const result = getters.allPrerequisitesReady(initialRootState)

    expect(result).toBeFalsy()
  })

  test('finished init', () => {
    const state = { ...initialRootState }
    state.accounts.active = 'accountAddress'
    // state.webrtc.initialized = true

    const result = getters.allPrerequisitesReady(state)
    expect(result).toBeTruthy()
  })
})
