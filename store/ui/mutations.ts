import { NuxtState } from '@nuxt/types/app'
import { Channel } from '~/types/ui/server'

export default {
  toggleContextMenu(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      contextMenuStatus: enabled,
    }
  },
  showSidebarUsers(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      showSidebarUsers: enabled,
    }
  },
  setContextMenuValues(state: NuxtState, values: any) {
    state.ui = {
      ...state.ui,
      contextMenuValues: values,
    }
  },
  setContextMenuPosition(state: NuxtState, e: any) {
    state.ui = {
      ...state.ui,
      contextMenuPosition: { x: e.x, y: e.y },
    }
  },
  setQuickProfilePosition(state: NuxtState, e: any) {
    state.ui = {
      ...state.ui,
      quickProfilePosition: { x: e.x, y: e.y },
    }
  },
  quickProfile(state: NuxtState, profile: Object | Boolean) {
    state.ui = {
      ...state.ui,
      quickProfile: profile,
    }
  },
  chatbarContent(state: NuxtState, content: String) {
    state.ui = {
      ...state.ui,
      chatbarContent: content,
    }
  },
  fullscreen(state: NuxtState, fullscreen: Boolean) {
    state.ui = {
      ...state.ui,
      fullscreen,
    }
  },
  toggleEnhancers(state: NuxtState, show: Boolean) {
    state.ui = {
      ...state.ui,
      showEnhancers: show,
    }
  },
  toggleSettings(state: NuxtState, show: Boolean) {
    state.ui = {
      ...state.ui,
      showSettings: show,
    }
  },
  toggleModal(state: NuxtState, modal: any) {
    state.ui.modals[modal.name] = modal.state
  },
  showSearchResult(state: NuxtState, enabled: Boolean) {
    state.ui = {
      ...state.ui,
      showSearchResult: enabled,
    }
  },
  setMessages(state: NuxtState, messages: any[]) {
    state.ui.messages = messages
  },
  setIsScrollOver(state: NuxtState, status: boolean) {
    state.ui.isScrollOver = status
    if (!status) state.ui.unreadMessage = 0
  },
  sendMessage(state: NuxtState, message: any, isOwner: boolean) {
    const messages: any[] = [...state.ui.messages]
    const lastIndex = messages.length - 1
    const lastMessage = messages[lastIndex]
    if (lastMessage) {
      const messageContent = {
        id: Date.now(),
        at: Date.now(),
        type: 'text',
        payload: message.value,
        replies: [],
      }
      if (lastMessage.from === message.user.address) {
        state.ui.messages[lastIndex].messages.push({
          ...messageContent,
        })
      } else {
        state.ui.messages.push({
          id: Date.now(),
          at: Date.now(),
          type: 'group',
          from: message.user.address,
          to: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
          messages: [
            {
              ...messageContent,
            },
          ],
        })
      }
      if (!isOwner && state.ui.isScrollOver) state.ui.unreadMessage++
    }
  },
  setTypingUser(state: NuxtState, user: Object | Boolean) {
    state.ui = {
      ...state.ui,
      isTyping: user,
    }
  },
  setActiveChannel(state: NuxtState, channel: Channel) {
    state.ui = {
      ...state.ui,
      activeChannel: channel,
    }
  },
  setReplyChatbarContent(
    state: NuxtState,
    message: {
      id: String
      from: String
      payload: String
    }
  ) {
    state.ui = {
      ...state.ui,
      replyChatbarContent: message,
    }
  },
}
