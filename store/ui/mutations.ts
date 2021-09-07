import { NuxtState } from '@nuxt/types/app'

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
  settingReaction(state: NuxtState, status: Boolean) {
    state.ui = {
      ...state.ui,
      settingReaction: status,
    }
  },
  addReaction(state: NuxtState, reaction: any) {
    // - break down and turn into util for finding specific message indicies & refactor to make cleaner
    const messageGroups: any[] = [...state.media.messages]
    // Find message group meant for reaction
    for (let i = 0; i < messageGroups.length; i++) {
      if (!messageGroups[i].messages) {
        continue
      }
      if ((messageGroups[i].id = reaction.groupID)) {
        const currGroup = messageGroups[i]
        // Find message in message group meant for reaction
        for (let j = 0; j < currGroup.messages.length; j++) {
          const currMessage = currGroup.messages[j]
          if (currMessage.id === reaction.messageID) {
            // if reactions array doesnt exist create with new reaction
            if (!currMessage.reactions) {
              state.media.messages[i].messages[j].reactions = [
                {
                  emoji: reaction.emoji,
                  reactors: [reaction.reactor],
                },
              ]
              return
            }
            // if reaction exists either add or remove reactor based on reaction.reactor
            for (let k = 0; k < currMessage.reactions.length; k++) {
              const currReaction = currMessage.reactions[k]
              if (currReaction.emoji === reaction.emoji) {
                if (currReaction.reactors.includes(reaction.reactor)) {
                  for (let l = 0; l < currReaction.reactors.length; l++) {
                    const currReactor = currReaction.reactors[l]
                    if (currReactor === reaction.reactor) {
                      // if reactor exists remove reactor
                      currReaction.reactors.splice(l, 1)
                    }
                  }
                  if (currReaction.reactors.length === 0) {
                    // if reactors array has no reactors remove reaction
                    currMessage.reactions.splice(k, 1)
                  }
                } else {
                  currReaction.reactors.push(reaction.reactor)
                }
                return
              }
            }
            // if reaction array exists and reaction emoji doesnt exist
            if (currMessage.reactions) {
              currMessage.reactions.push({
                emoji: reaction.emoji,
                reactors: [reaction.reactor],
              })
              return
            }
          }
        }
      }
    }
  },
}
