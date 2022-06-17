import { PublicKey } from '@solana/web3.js'
import { keys } from 'libp2p-crypto'
import { createFromPubKey } from 'peer-id'
import {
  ConversationActivity,
  ConversationParticipant,
  ConversationState,
} from './types'
import { ActionsArguments } from '~/types/store/store'

const actions = {
  /**
   * @method initialize
   * @description Initialize the conversation store
   * @example
   * store.dispatch('conversation/initialize');
   */
  initialize({ commit }: ActionsArguments<ConversationState>) {
    commit('setConversation', {
      id: '',
      type: 'friend',
      calling: false,
      participants: [],
    })
  },
  /**
   * @method setConversation
   * @description Set the current conversation
   * @example
   * store.dispatch('conversation/setConversation', conversation);
   */
  setConversation(
    { commit }: ActionsArguments<ConversationState>,
    payload: {
      id: string
      type: 'friend' | 'group'
      calling?: boolean
      participants: Array<ConversationParticipant>
    },
  ) {
    commit('setConversation', payload)
  },
  /**
   * @method setCalling
   * @description Set the calling state of the conversation
   * @example
   * store.dispatch('conversation/setCalling', true);
   */
  setCalling(
    { commit }: ActionsArguments<ConversationState>,
    calling: boolean,
  ) {
    commit('setCalling', calling)
  },
  /**
   * @method addParticipant
   * @description Add a participant to the conversation
   * @example
   * store.dispatch('conversation/addParticipant', participant);
   */
  async addParticipant(
    { commit, state, rootState }: ActionsArguments<ConversationState>,
    address: string,
  ) {
    const friend = rootState.friends.all.find((fr) => fr.address === address)
    const participant = state.participants?.find((p) => p.address === address)

    let peerId = friend?.peerId || participant?.peerId
    if (!peerId) {
      peerId = (
        await createFromPubKey(
          keys.supportedKeys.ed25519.unmarshalEd25519PublicKey(
            new PublicKey(address).toBytes(),
          ).bytes,
        )
      ).toB58String()
    }

    const participantDescriptor = {
      address,
      peerId,
      textilePubkey: friend?.textilePubkey || participant?.textilePubkey,
      name: friend?.name || participant?.name,
      state: friend
        ? friend.state === 'online'
          ? 'CONNECTED'
          : 'DISCONNECTED'
        : participant?.state || 'DISCONNECTED',
      profilePicture: participant?.profilePicture,
      activity: ConversationActivity.NOT_TYPING,
    }

    commit(
      participant ? 'updateParticipant' : 'addParticipant',
      participantDescriptor,
    )
  },
  /**
   * @method addParticipants
   * @description Add multiple participants to the conversation
   * @param participants
   * @example
   * store.dispatch('conversation/addParticipants', participants);
   */
  addParticipants(
    action: ActionsArguments<ConversationState>,
    participants: string[],
  ) {
    participants.forEach((address) => {
      action.dispatch('addParticipant', address)
    })
  },
}
export default actions
