import { without } from 'lodash'
import { EnhancerInfo, Theme, UIState } from './types'
import { MessageGroup } from '~/types/messaging'
import { Channel } from '~/types/ui/server'

export default {
  togglePinned(state: UIState, visible: boolean) {
    state.showPinned = visible
  },
  toggleContextMenu(state: UIState, enabled: boolean) {
    state.contextMenuStatus = enabled
  },
  showSidebarUsers(state: UIState, enabled: boolean) {
    state.showSidebarUsers = enabled
  },
  setContextMenuValues(state: UIState, values: any) {
    state.contextMenuValues = values
  },
  setContextMenuPosition(state: UIState, e: any) {
    state.contextMenuPosition = { x: e.x, y: e.y }
  },
  setQuickProfilePosition(state: UIState, e: any) {
    state.quickProfilePosition = { x: e.x, y: e.y }
  },
  quickProfile(state: UIState, profile: Object | boolean) {
    state.quickProfile = profile
  },
  chatbarContent(state: UIState, content: string) {
    state.chatbarContent = content
  },
  fullscreen(state: UIState, fullscreen: boolean) {
    state.fullscreen = fullscreen
  },
  toggleEnhancers(state: UIState, options: EnhancerInfo) {
    state.enhancers = {
      show: options.show,
      floating:
        typeof options.floating !== 'undefined'
          ? options.floating
          : state.enhancers.floating,
      position:
        typeof options.position !== 'undefined'
          ? options.position
          : state.enhancers.position,
      defaultWidth:
        typeof options.defaultWidth !== 'undefined'
          ? options.defaultWidth
          : state.enhancers.defaultWidth,
      defaultHeight:
        typeof options.defaultHeight !== 'undefined'
          ? options.defaultHeight
          : state.enhancers.defaultHeight,
      containerWidth:
        typeof options.containerWidth !== 'undefined'
          ? options.containerWidth
          : state.enhancers.containerWidth,
      route: options.route || 'emotes',
    }
  },
  toggleSettings(state: UIState, show: boolean) {
    state.showSettings = show
  },
  toggleSettingsSidebar(state: UIState, show: boolean) {
    state.settingsSideBar = show
  },
  toggleModal(state: UIState, modal: any) {
    // @ts-ignore
    state.modals[modal.name] = modal.state
  },
  setGlyphModalPack(state: UIState, pack: string) {
    state.glyphModalPack = pack
  },
  showSearchResult(state: UIState, enabled: boolean) {
    state.showSearchResult = enabled
  },
  setMessages(state: UIState, messages: any[]) {
    state.messages = messages
  },
  setIsScrollOver(state: UIState, status: boolean) {
    state.isScrollOver = status
    if (!status) state.unreadMessage = 0
  },
  setIsReacted(state: UIState, status: boolean) {
    state.isReacted = status
  },
  /**
   * @method sendMessage DocsTODO
   * @description
   * @param message
   * @param isOwner
   * @example
   */
  sendMessage(state: UIState, message: any, isOwner: boolean) {
    const messages: any[] = [...state.messages]
    const lastIndex = messages.length - 1
    const lastMessage = messages[lastIndex]
    if (lastMessage) {
      const messageContent = {
        id: Date.now(),
        at: Date.now(),
        type: 'text',
        payload: message.value,
        reactions: [],
        replies: [],
      }
      if (lastMessage.from === message.user.address) {
        state.messages[lastIndex].messages.push({
          ...messageContent,
        })
      } else {
        state.messages.push({
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
      if (!isOwner && state.isScrollOver) state.unreadMessage++
    }
  },
  setTypingUser(state: UIState, user: Object | boolean) {
    state.isTyping = user
  },
  setActiveChannel(state: UIState, channel: Channel) {
    state.activeChannel = channel
  },
  setReplyChatbarContent(
    state: UIState,
    message: {
      id: String
      from: String
      payload: String
    },
  ) {
    state.replyChatbarContent = message
  },
  settingReaction(state: UIState, status: boolean) {
    state.settingReaction = status
  },
  /**
   * Called when user click the Edit Message on Context Menu or Edit action in message listings
   * @param {UIState} state - Vuex state
   * @param message  - Message to edit {id: message's id, from: group's id, payload: content}
   */
  setEditMessage(
    state: UIState,
    message: {
      id: string
      from: string
      payload: string
    },
  ) {
    state.editMessage = message
  },
  /**
   * Called when user complete to edit message, then update the message in message listing
   * @param {UIState} state - Vuex state
   * @param message  - Message to edit {id: message's id, from: group's id, payload: content}
   */
  saveEditMessage(
    state: UIState,
    message: {
      id: String
      from: String
      payload: String
    },
  ) {
    const messages: any[] = [...state.messages]
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
        state.messages = messages
      }
    }
  },
  /**
   * @method addReaction DocsTODO
   * @description
   * @param reaction
   * @example
   */
  addReaction(state: UIState, reaction: any) {
    const messageGroups: MessageGroup = [...state.messages]

    // ßFind message group meant for reaction
    const currGroup = messageGroups?.find(
      (group) => group.id === reaction.groupID,
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
          (message) => message.id === reaction.messageID,
        )
      }

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
        } else {
          // If reactions array exist
          // Find selected reaction
          const currReaction = currMessage.reactions.find(
            (react) => react.emoji === reaction.emoji,
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
                currReaction,
              )
            } else if (currReaction?.reactors.includes(reaction.reactor)) {
              // If the selected reactions already has the reactor
              currReaction.reactors = without(
                currReaction.reactors,
                reaction.reactor,
              )
            } else {
              // If the selected reactions doesnt have the reactor
              currReaction?.reactors.push(reaction.reactor)
            }
          } else {
            // If selected reaction doesnt exist in reactions array
            currMessage.reactions.push({
              emoji: reaction.emoji,
              reactors: [reaction.reactor],
              showReactors: false,
            })
          }
          state.isReacted = true
        }
      }
    }
  },
  setHoveredGlyphInfo(state: UIState, values: Object | undefined) {
    state.hoveredGlyphInfo = values
  },
  updateRecentReactions(state: UIState, emoji: String) {
    const newRecentReactions = state.recentReactions
    if (!state.recentReactions.includes(emoji)) {
      newRecentReactions.unshift(emoji)
      newRecentReactions.pop()
    }

    state.recentReactions = newRecentReactions
  },
  setGlyphMarketplaceView(state: UIState, values: Object) {
    state.glyphMarketplaceView = values
  },
  updateMostUsedEmoji(state: UIState, emojiObj: any) {
    const emojiUsed = state.mostEmojiUsed.find(
      (elm) => elm.code === emojiObj.name,
    )
    if (emojiUsed) {
      emojiUsed.count++
      return
    }
    state.mostEmojiUsed.push({
      code: emojiObj.name,
      content: emojiObj.emoji,
      count: 1,
    })
  },
  updateTheme(state: UIState, theme: Theme) {
    state.theme.base = theme
  },
  updateFlair(state: UIState, flair: String) {
    state.theme.flair = flair
  },
}
