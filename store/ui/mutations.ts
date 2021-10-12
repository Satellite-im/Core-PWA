import { NuxtState } from '@nuxt/types/app'
import { without } from 'lodash'
import { MessageGroup } from '~/types/messaging'
import { Channel } from '~/types/ui/server'

export default {
  togglePinned(state: NuxtState, visible: Boolean) {
    state.ui = {
      ...state.ui,
      showPinned: visible,
    }
  },
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
  settingReaction(state: NuxtState, status: Boolean) {
    state.ui = {
      ...state.ui,
      settingReaction: status,
    }
  },
  setEditMessage(
    state: NuxtState,
    message: {
      id: String
      from: String
      payload: String
    }
  ) {
    state.ui = {
      ...state.ui,
      editMessage: message,
    }
  },
  saveEditMessage(
    state: NuxtState,
    message: {
      id: String
      from: String
      payload: String
    }
  ) {
    const messages: any[] = [...state.ui.messages]
    let found = messages.find((item) => {
      if (item.id === message.from) {
        return true
      }
      return false
    })
    if (found) {
      found = found.messages.find((item: any) => {
        if (item.id === message.id) {
          return true
        }
        return false
      })
      if (found) {
        found.payload = message.payload
        state.ui = {
          ...state.ui,
          messages,
        }
      }
    }
  },

  addReaction(state: NuxtState, reaction: any) {
    console.log(reaction)
    const messageGroups: MessageGroup = [...state.ui.messages]

    //Find message group meant for reaction
    const currGroup = messageGroups?.find(
      (group) => group.id === reaction.groupID
    )

    if (currGroup?.messages) {
      // Find message in message group or reply in message meant for reaction
      let currMessage
      if (reaction.replyID) {
        currMessage = currGroup?.messages
          .find((message) => message.id === reaction.messageID)
          ?.replies.find((reply) => reply.id === reaction.replyID)
      } else {
        currMessage = currGroup?.messages.find(
          (message) => message.id === reaction.messageID
        )
      }

      console.log(currMessage)

      if (currMessage) {
        // If reactions array doesnt exist create with new reaction
        if (!currMessage.reactions) {
          currMessage.reactions = [
            {
              emoji: reaction.emoji,
              reactors: [reaction.reactor],
              showReactors: false,
            },
          ]
          return
        } else {
          // If reactions array exist
          // Find selected reaction
          const currReaction = currMessage.reactions.find(
            (react) => react.emoji == reaction.emoji
          )
          if (currReaction) {
            // If selected reaction already exist in reactions array
            if (
              currReaction?.reactors.includes(reaction.reactor) &&
              currReaction.reactors.length === 1
            ) {
              // If the selected reactions already has the reactor and is the only one
              currMessage.reactions = without(
                currMessage.reactions,
                currReaction
              )
            } else if (currReaction?.reactors.includes(reaction.reactor)) {
              // If the selected reactions already has the reactor
              currReaction.reactors = without(
                currReaction.reactors,
                reaction.reactor
              )
            } else {
              // If the selected reactions doesnt have the reactor
              currReaction?.reactors.push(reaction.reactor)
            }
          } else {
            // If selected reaction doesnt exist in reactions array
            console.log('ENTER')
            currMessage.reactions.push({
              emoji: reaction.emoji,
              reactors: [reaction.reactor],
              showReactors: false,
            })
            return
          }
        }
      }
    }
  },
  setHoveredGlyphInfo(state: NuxtState, values: Object | undefined) {
    state.ui = {
      ...state.ui,
      hoveredGlyphInfo: values,
    }
  },
  updateRecentReactions(state: NuxtState, emoji: String) {
    const newRecentReactions = state.ui.recentReactions
    if (!state.ui.recentReactions.includes(emoji)) {
      newRecentReactions.unshift(emoji)
      newRecentReactions.pop()
    }
    state.ui = {
      ...state.ui,
      recentReactions: newRecentReactions,
    }
  },
}
