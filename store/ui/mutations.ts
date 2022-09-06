import { without } from 'lodash'
import {
  EnhancerInfo,
  Position,
  RecentGlyph,
  SettingsRoutes,
  UIState,
} from './types'
import { MessageGroup } from '~/types/messaging'
import { Channel } from '~/types/ui/server'
import { FileMessage } from '~/types/textile/mailbox'

export default {
  togglePinned(state: UIState, visible: boolean) {
    state.showPinned = visible
  },
  toggleContextMenu(state: UIState, enabled: boolean) {
    state.contextMenuStatus = enabled
  },

  showSidebar(state: UIState, enabled: boolean) {
    state.showSidebar = enabled
  },
  setContextMenuValues(state: UIState, values: any) {
    state.contextMenuValues = values
  },
  setContextMenuPosition(state: UIState, e: any) {
    state.contextMenuPosition = { x: e.x, y: e.y }
  },
  setQuickProfilePosition(state: UIState, position: Position) {
    state.quickProfilePosition = position
  },
  quickProfile(state: UIState, profile: Object | boolean) {
    state.quickProfile = profile
  },
  setUserProfile(state: UIState, userProfile: Object) {
    state.userProfile = userProfile
  },
  chatbarContent(state: UIState, content: string) {
    state.chatbarContent = content
  },
  setChatImageOverlay(state: UIState, image: FileMessage | undefined) {
    state.chatImageOverlay = image
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
      route: options.route || 'emoji',
    }
  },
  setSettingsRoute(
    state: UIState,
    route: SettingsRoutes = SettingsRoutes.PERSONALIZE,
  ) {
    state.settingsRoute = route
  },
  toggleModal(state: UIState, modal: any) {
    // @ts-ignore
    state.modals[modal.name] = modal.state
  },
  toggleErrorNetworkModal(
    state: UIState,
    modal: { state: boolean; action: Function | null },
  ) {
    // @ts-ignore
    state.modals.errorNetwork = { isOpen: modal.state, action: modal.action }
  },
  setGlyphModalPackId(state: UIState, packId: string) {
    state.glyphModalPackId = packId
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
  setShowOlderMessagesInfo(state: UIState, flag: boolean) {
    state.showOlderMessagesInfo = flag
  },
  setIsReacted(state: UIState, status: boolean) {
    state.isReacted = status
  },
  welcomeDismiss(state: UIState) {
    state.welcomeMessage = false
  },
  welcomeSet(state: UIState, welcome: boolean) {
    state.welcomeMessage = welcome
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
  settingReaction(state: UIState, status: object) {
    state.settingReaction = status // TODO: check this mutation, probably a bug
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
      id: string
      from: string
      payload: string
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
  updateRecentGlyphs(state: UIState, glyph: RecentGlyph) {
    const glyphUsed = state.recentGlyphs.find((e) => e.url === glyph.url)
    if (glyphUsed) {
      glyphUsed.count++
      return
    }
    state.recentGlyphs.push({
      pack: glyph.pack,
      url: glyph.url,
      count: 1,
    })
  },
  removeNotification(state: UIState, id: string) {
    state.notifications = state.notifications.filter((item) => item.id !== id)
  },
  setChatbarFocus(state: UIState, status: boolean) {
    state.chatbarFocus = status
  },
  setIsMobileNavVisible(state: UIState, value: boolean) {
    state.isMobileNavVisible = value
  },
  setCallHeight(state: UIState, value: string) {
    state.callHeight = value
  },
}
