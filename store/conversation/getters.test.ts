import { expect } from '@jest/globals'
import {
  ConversationActivity,
  ConversationConnection,
  ConversationParticipant,
  ConversationState,
} from './types'
import * as module from '~/store/conversation/getters'

describe('misc', () => {
  const InitialConversationState: ConversationState = {
    id: '',
    type: 'friend',
    calling: false,
    participants: [],
  }

  test('otherParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: null, // This element in this array will not be this included because null
        profilePicture: 'profilePicture2',
        state: ConversationConnection.DISCONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] =
      module.default.otherParticipants(localState)

    expect(result).toMatchSnapshot()
  })

  test('onlineParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.DISCONNECTED, // This element in this array will not be this included because it is not CONNECTED (type)
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: 'name2',
        profilePicture: 'profilePicture2',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.ACTIVE,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] = module.default.onlineParticipants(
      localState,
      { otherParticipants: argument },
    )

    expect(result).toMatchSnapshot()
  })

  test('typingParticipants', () => {
    const argument: ConversationParticipant[] = [
      {
        peerId: 'peerId',
        address: 'address',
        name: 'name',
        profilePicture: 'profilePicture',
        state: ConversationConnection.DISCONNECTED,
        activity: ConversationActivity.ACTIVE, // This element in this array will not be this included because it is not TYPING (type)
        updatedAt: 123,
      },
      {
        peerId: 'peerId2',
        address: 'address2',
        name: 'name2',
        profilePicture: 'profilePicture2',
        state: ConversationConnection.CONNECTED,
        activity: ConversationActivity.TYPING,
        updatedAt: 123,
      },
    ]
    const localState = { ...InitialConversationState }
    localState.participants = argument

    const result: ConversationParticipant[] = module.default.typingParticipants(
      localState,
      { otherParticipants: argument },
    )

    expect(result).toMatchSnapshot()
  })
})
