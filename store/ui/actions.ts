import Mousetrap from 'mousetrap'
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Position, UIState } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import { ActionsArguments } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import { Channel } from '~/types/ui/server'
import { getFullUserInfoFromState } from '~/utilities/Messaging'
import { getCorrectKeybind } from '~/utilities/Keybinds'
import { TextileError } from '~/store/textile/types'
import { AlertType } from '~/libraries/ui/Alerts'

const $Sounds = new SoundManager()

export default {
  setMessages({ commit }: ActionsArguments<UIState>, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit, rootState }: ActionsArguments<UIState>, message: any) {
    if (message.user.address !== rootState.accounts.active) {
      $Sounds.playSound(Sounds.NEW_MESSAGE)
    }
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: ActionsArguments<UIState>, status: boolean) {
    commit('setIsScrollOver', status)
  },
  setIsReacted({ commit }: ActionsArguments<UIState>, status: boolean) {
    commit('setIsReacted', status)
  },
  setActiveChannel({ commit }: ActionsArguments<UIState>, channel: Channel) {
    commit('setActiveChannel', channel)
  },
  /**
   * @method openSettings
   * @description Opens setting page
   * @example Mousetrap.bind('ctrl+s', dispatch('audio/toggleMute') )
   */
  openSettings({ commit, state }: any) {
    commit('toggleSettings', { show: !state.showSettings })
  },
  /**
   * @method activateKeybinds
   * @description Activates all keybindings with Mousetrap
   * @example mounted (){ activateKeybinds() }
   */
  async activateKeybinds({ dispatch, rootState }: ActionsArguments<UIState>) {
    const { toggleMute, toggleDeafen, openSettings, callActiveChat } =
      // @ts-ignore
      rootState.settings.keybinds
    Mousetrap.reset()
    Mousetrap.bind(getCorrectKeybind(toggleMute), (event: KeyboardEvent) => {
      event.preventDefault()
      dispatch('audio/toggleMute', null, { root: true })
    })
    Mousetrap.bind(getCorrectKeybind(toggleDeafen), (event: KeyboardEvent) => {
      event.preventDefault()
      dispatch('audio/toggleDeafen', null, { root: true })
    })
    Mousetrap.bind(getCorrectKeybind(openSettings), (event: KeyboardEvent) => {
      event.preventDefault()
      dispatch('openSettings')
    })
    Mousetrap.bind(
      getCorrectKeybind(callActiveChat),
      (event: KeyboardEvent) => {
        event.preventDefault()
        dispatch('webrtc/call', { kinds: ['audio'] }, { root: true })
      },
    )
  },
  /**
   * @method setNotifications
   * @description Collects all existing notifications for a user
   */
  async setNotifications({ commit }: ActionsArguments<UIState>) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.notificationManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const notifications =
      await $TextileManager.notificationManager?.getnotifications()
    commit('setNotifications', notifications)
  },
  async sendNotification(
    { commit, rootState }: ActionsArguments<UIState>,
    payload: {
      message: string
      from: string
      imageHash: string
      title: string
      type: AlertType
    },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.notificationManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const notificationResponse =
      await $TextileManager.notificationManager?.sendNotification({
        from: payload.from,
        id: uuidv4(),
        title: payload.title,
        imageHash: payload.imageHash,
        message: payload.message,
        type: payload.type,
      })
    commit('sendNotification', notificationResponse)
  },
  removeSeenNotification(
    { commit, rootState }: ActionsArguments<UIState>,
    notificationId: string,
  ) {
    commit('notificationSeen', notificationId)
  },
  /**
   * @method clearKeybinds
   * @description Unbinds all current keybindings with Mousetrap
   * @example destroyed (){ clearKeybinds() }
   */
  async clearKeybinds({ dispatch }: ActionsArguments<UIState>) {
    Mousetrap.reset()
  },
  async setChatbarFocus({ dispatch }: ActionsArguments<UIState>) {
    await dispatch('toggleChatbarFocus', false)
    dispatch('toggleChatbarFocus', true)
  },
  toggleChatbarFocus({ commit }: ActionsArguments<UIState>, flag: boolean) {
    commit('setChatbarFocus', flag)
  },
  setChatbarContent(
    { commit, dispatch }: ActionsArguments<UIState>,
    val: {
      content: string
      userId?: string
    },
  ) {
    commit('chatbarContent', val.content)
    if (val.userId)
      dispatch(
        'chat/setChatText',
        { value: val.content, userId: val.userId },
        { root: true },
      )
  },
  showQuickProfile(
    { commit, state, rootState }: ActionsArguments<UIState>,
    payload: { textilePublicKey: string; position: Position },
  ) {
    if (!payload?.textilePublicKey || !payload?.position) {
      return
    }

    const selectedUser = getFullUserInfoFromState(
      payload.textilePublicKey,
      rootState,
    )

    commit('setQuickProfilePosition', payload.position)
    commit('quickProfile', selectedUser)
  },
  async showProfile(
    { commit, rootState, dispatch }: ActionsArguments<UIState>,
    user: Friend,
  ) {
    if (!user) {
      return
    }
    let metadata = null
    if (!user.metadata) {
      const $TextileManager: TextileManager = Vue.prototype.$TextileManager
      metadata = await $TextileManager.metadataManager?.getFriendMetadata(
        user.address,
      )
    }
    commit('toggleModal', {
      name: 'userProfile',
      state: true,
    })
    const friend = {
      ...user,
    }
    if (metadata) {
      friend.metadata = metadata
      commit('friends/updateFriend', friend, { root: true })
    }
    commit('setUserProfile', friend)
  },
}
