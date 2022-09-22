import * as module from './getters'
import { WebRTCState } from '~/store/webrtc/types'
import InitialWebRTCState from '~/store/webrtc/state'

import { RootState } from '~/types/store/store'
import InitialAccountsState from '~/store/accounts/state'
import InitialDataState from '~/store/dataState/state'
import InitialFriendsState from '~/store/friends/state'
import InitialUIState from '~/store/ui/state'
import InitialGroupsState from '~/store/groups/state'
import InitialSettingsState from '~/store/settings/state'
import InitialConversationState from '~/store/conversation/state'
import InitialAudioState from '~/store/audio/state'
import InitialVideoState from '~/store/video/state'
import InitialChatState from '~/store/chat/state'
import InitialMediaState from '~/store/media/state'
import InitialMetaState from '~/store/meta/state'
import InitialSoundsState from '~/store/sounds/state'
import InitialFilesState from '~/store/files/state'

let initialState: WebRTCState
let initialRootState: RootState

describe('Test webrtc/getters', () => {
  beforeEach(() => {
    initialState = InitialWebRTCState()
    initialRootState = {
      accounts: InitialAccountsState(),
      audio: InitialAudioState(),
      chat: InitialChatState(),
      conversation: InitialConversationState(),
      dataState: InitialDataState(),
      files: InitialFilesState(),
      friends: InitialFriendsState(),
      groups: InitialGroupsState(),
      media: InitialMediaState(),
      meta: InitialMetaState(),
      settings: InitialSettingsState(),
      sounds: InitialSoundsState(),
      ui: InitialUIState(),
      video: InitialVideoState(),
    }
  })

  it('should get isActiveCall for undefined activeCall', () => {
    const firstArgument: WebRTCState = initialState
    const secondArgument = {} // getters
    const thirdArgument: RootState = initialRootState

    const expectedResult = firstArgument.activeCall // value is undefined

    const result = module.default.isActiveCall(
      firstArgument,
      secondArgument,
      thirdArgument,
    )

    expect(result).toEqual(expectedResult) // returns undefined too
    expect(result).toBeUndefined()
  })

  it('should get isActiveCall for empty object activeCall', () => {
    const firstArgument: WebRTCState = {
      ...initialState,
      activeCall: {},
    }
    const secondArgument = {} // getters
    const thirdArgument: RootState = initialRootState

    const expectedResult = firstArgument.activeCall // value is empty object

    const result = module.default.isActiveCall(
      firstArgument, // Returns error because it should not be just a boolean value, but an object
      secondArgument,
      thirdArgument,
    )

    expect(result).not.toEqual(expectedResult) // Does not return true.
    // It instead returns undefined. Why?
    // Because (true && undefined && undefined) returns undefined, not true.
    expect(result).toBeUndefined()
  })

  it('should get isActiveCall for peerId object activeCall', () => {
    const firstArgument: WebRTCState = {
      ...initialState,
      activeCall: {
        callId: '0xcall',
        peerId: '0xpeer',
      },
    }
    const secondArgument = {} // getters
    const thirdArgument: RootState = initialRootState

    const expectedResult = false // value is boolean

    const result = module.default.isActiveCall(
      firstArgument,
      secondArgument,
      thirdArgument,
    )

    expect(result).toEqual(expectedResult) // Returns false.
    // Why does it return false? Because the expression it tries to evaluate is:
    // { callId: '0xcall', peerId: '0xpeer' } && 0xpeer && false
    // Which evaluates to false. As we recall: true && true && false evaluates to false.
  })

  it('should get isActiveCall for peerId object activeCall with modified RootState', () => {
    const firstArgument: WebRTCState = {
      ...initialState,
      activeCall: {
        callId: '0xcall',
        peerId: '0xpeer',
      },
    }
    const secondArgument = {} // getters
    const thirdArgument: RootState = {
      ...initialRootState,
      conversation: {
        type: 'friend',
        calling: false,
        participants: [],
        id: firstArgument.activeCall?.peerId as string, // We give a ? here because activeCall is possible to undefined
        // We add an `as string` -- a type assertion -- so that we do not get the error: Type 'string | undefined' is not assignable to type 'string'.
      },
    }
    const expectedResult = true // value is boolean

    const result = module.default.isActiveCall(
      firstArgument,
      secondArgument,
      thirdArgument,
    )

    expect(result).toEqual(expectedResult) // Returns true.
    // Why does it return true? Because the expression it tries to evaluate is:
    // { callId: '0xcall', peerId: '0xpeer' } && 0xpeer && true
    // The last term is true because initialState.activeCall.peerId is equal to initialRootState.conversation.id
    // Which evaluates to true. As we recall: true && true && true evaluates to true.
  })
})
