<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import {
  ChevronDownIcon,
  KeyIcon,
  FileIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  XIcon,
} from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { conversationMessageIsNotice } from '~/utilities/chat'
import { RootState } from '~/types/store/store'
import { ScrollerRef } from '~/components/ui/Chat/InfiniteScroll/InfiniteScroll.vue'
import { getTimestamp } from '~/utilities/timestamp'

export interface ChatItem {
  message: ConversationMessage
  showHeader: boolean
  timeDiff: number
  isNextDay: boolean
  replies: ConversationMessage[]
  isLastCallMessage: boolean
}

const MIN_MESSAGE_HEIGHT = 24 // 1.5 rem (reset.css)
const MULTIPLIER = 50
const MESSAGE_PAGE_SIZE = Math.max(
  Math.floor(window.innerHeight / MIN_MESSAGE_HEIGHT / MULTIPLIER) * MULTIPLIER,
  MULTIPLIER,
)
const MESSAGES_WINDOW = MESSAGE_PAGE_SIZE * 4

export default Vue.extend({
  components: {
    ChevronDownIcon,
    KeyIcon,
    FileIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    XIcon,
  },
  data() {
    return {
      trailingIndex: MESSAGE_PAGE_SIZE * 2,
      leadingIndex: 0,
      isLoadingMore: false,
      isBlurred: false,
      isUnreadAboveViewport: false,
      isUnreadBelowViewport: false,
      currentMarkerMessageId: null as string | null,
    }
  },
  computed: {
    ...mapState({
      activeUploadChats: (state) => (state as RootState).chat.activeUploadChats,
    }),
    myDid(): string {
      return iridium.id ?? ''
    },
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    conversation(): Conversation {
      return iridium.chat.state.conversations?.[this.conversationId] ?? {}
    },
    messages(): ConversationMessage[] {
      return [
        ...Object.values(this.conversation.message ?? []),
        ...this.ephemeralMessages,
      ].sort((a, b) => a.at - b.at)
    },
    ephemeralMessages(): ConversationMessage[] {
      return iridium.chat.ephemeral.conversations?.[this.conversationId] ?? []
    },
    chatItems(): ChatItem[] {
      const filtered = this.messages.filter((message) => !message.replyToId)
      const messages = filtered.slice(
        Math.max(filtered.length - this.trailingIndex, 0),
        filtered.length - this.leadingIndex,
      )
      const items = messages.map((message, index) => {
        const prevMessage = index >= 0 ? messages[index - 1] : undefined
        const isSameAuthor = prevMessage
          ? message.from === prevMessage.from
          : false
        const timeDiff = prevMessage ? message.at - prevMessage.at : 0
        const isNextDay = prevMessage
          ? !this.$dayjs(prevMessage.at).isSame(message.at, 'day')
          : true
        const lastReadAt = this.conversation.lastReadAt
        const isFirstUnreadMessage =
          !message.status &&
          message.at > lastReadAt &&
          (prevMessage ? prevMessage.at <= lastReadAt : true)
        if (isFirstUnreadMessage) {
          this.currentMarkerMessageId = message.id
        }
        const replies = this.messages.filter(
          (replyMessage) => replyMessage.replyToId === message.id,
        )
        const showHeader =
          message.type === 'call'
            ? false
            : !isSameAuthor ||
              (prevMessage &&
                (conversationMessageIsNotice(prevMessage) ||
                  prevMessage.type === 'call')) ||
              this.$dayjs.duration(timeDiff).minutes() >= 5 ||
              isNextDay ||
              false
        const isLastCallMessage =
          index ===
          messages.reduce((prev, _, i) => {
            return messages[i].type === 'call' ? i : prev
          }, -1)

        return {
          message,
          showHeader,
          timeDiff,
          isNextDay,
          isFirstUnreadMessage,
          replies,
          isLastCallMessage,
        }
      })
      return items
    },
    isLastChatItemAuthor(): boolean {
      const lastItem = this.messages[this.messages.length - 1]
      if (!lastItem || !iridium.connector) {
        return false
      }
      return !lastItem.replyToId && lastItem.from === iridium.connector.id
    },
    noMore(): boolean {
      return (
        this.trailingIndex >=
        this.messages.filter((message) => !message.replyToId).length
      )
    },
    numUnread(): number | null {
      if (!this.unreadMarkerMessageId) return null
      const [_, index] = this.getMessageIndexes(this.unreadMarkerMessageId)

      if (index === -1) return null
      return index + 1
    },
    unreadSince(): string | null {
      const message = this.messages.find(
        (m) => m.id === this.unreadMarkerMessageId,
      )
      if (!message) return null

      return getTimestamp(message.at)
    },
    messageWindow(): number {
      return this.trailingIndex - this.leadingIndex
    },
    noLeading(): boolean {
      return this.leadingIndex === 0
    },
    unreadMarkerMessageId(): string {
      let id = ''
      const lastReadAt = this.conversation.lastReadAt
      for (let i = 0; i < this.messages.length; i++) {
        const message = this.messages[i]
        const prevMessage = i >= 0 ? this.messages[i - 1] : undefined
        if (
          !message.status &&
          message.at > lastReadAt &&
          (prevMessage ? prevMessage.at <= lastReadAt : true)
        ) {
          id = message.id
          break
        }
      }
      return id
    },
  },
  watch: {
    messages(newValue, oldValue) {
      const scroller = this.$refs.container as ScrollerRef
      if (newValue.length !== oldValue.length) {
        if (this.isLastChatItemAuthor || scroller.isLockedToBottom) {
          scroller.scrollToBottom()
        }

        // Fill the available spots
        if (this.trailingIndex < MESSAGES_WINDOW) {
          this.trailingIndex++
        }
        // If we're full and not at the bottom, keep the message position
        else if (!scroller.isLockedToBottom) {
          this.trailingIndex++
          this.leadingIndex++
        }
      }
    },
    isLastChatItemAuthor(newValue) {
      if (newValue) {
        this.currentMarkerMessageId = null
      }
    },
  },
  mounted() {
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)

    // todo - fix type definition, can be undefined on mobile
    if (this.conversationId) {
      iridium.chat.updateConversationReadAt(this.conversationId, Date.now())
    }

    // Set active conversation ID
    iridium.chat.ephemeral.activeConversationId = this.conversationId
  },
  beforeDestroy() {
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)

    // Clear active conversation ID
    iridium.chat.ephemeral.activeConversationId = ''
  },
  methods: {
    handleBlur() {
      this.isBlurred = true
    },
    handleFocus() {
      this.isBlurred = false
      const scroller = this.$refs.container as ScrollerRef
      if (this.conversationId && scroller.isLockedToBottom) {
        iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())
      }
    },
    loadMore() {
      // TODO: we'll want to instead call iridium in this method once paginated
      // fetching is added, for now we'll just take a slice.
      this.isLoadingMore = true
      const lastMessage = this.chatItems[0]
      setTimeout(() => {
        this.isLoadingMore = false
        this.trailingIndex += MESSAGE_PAGE_SIZE
        const container = (this.$refs.container as ScrollerRef).$el

        const currentScrollTop = container.scrollTop
        const currentScrollHeight = container.scrollHeight

        const top = this.getMessageOffsets(lastMessage.message.id).top
        const difference = container.scrollTop + container.clientHeight - top

        this.$nextTick(() => {
          container.scrollTop =
            container.scrollHeight -
            currentScrollHeight +
            // in case the user has scrolled in the meanwhile, make up the difference
            currentScrollTop -
            // in case the user has scrolled beyond the loaders, lets reset the scroll position above the lastMessage
            Math.min(difference, 0)

          if (this.messageWindow > MESSAGES_WINDOW) {
            // the + (this.messageWindow - MESSAGES_WINDOW) is for compensating eventual "scroll to message"
            this.leadingIndex +=
              MESSAGE_PAGE_SIZE + (this.messageWindow - MESSAGES_WINDOW)
          }
        })
      }, 250)
    },
    loadLess() {
      this.isLoadingMore = true
      const firstMessage = this.chatItems[this.chatItems.length - 1]?.message.id
      setTimeout(() => {
        const delta =
          this.trailingIndex - MESSAGES_WINDOW >= MESSAGE_PAGE_SIZE
            ? MESSAGE_PAGE_SIZE
            : this.trailingIndex - MESSAGES_WINDOW

        // the + (this.messageWindow - MESSAGES_WINDOW) is for compensating eventual "scroll to message"
        this.trailingIndex -= delta + (this.messageWindow - MESSAGES_WINDOW)
        this.isLoadingMore = false

        const container = (this.$refs.container as ScrollerRef).$el

        const currentScrollTop = container.scrollTop
        const currentScrollHeight = container.scrollHeight

        this.$nextTick(() => {
          const bottom = this.getMessageOffsets(firstMessage).bottom
          container.scrollTop =
            container.scrollHeight -
            currentScrollHeight +
            // in case the user has scrolled in the meanwhile, make up the difference
            currentScrollTop -
            Math.max(container.scrollTop - bottom, 0)

          this.leadingIndex -= delta
        })
      }, 250)
    },
    onUnreadMessage({
      isAboveViewport,
      isBelowViewport,
    }: {
      message: ConversationMessage
      messageEl: HTMLElement
      isAboveViewport: boolean
      isBelowViewport: boolean
    }) {
      this.isUnreadAboveViewport = isAboveViewport
      this.isUnreadBelowViewport = isBelowViewport
    },
    scrollUnreadIntoView() {
      if (!this.unreadMarkerMessageId) return

      const unreadMessage = document.querySelector(
        `[data-message-id="${this.unreadMarkerMessageId}"]`,
      ) as HTMLElement

      // If the element is not in the dom lets determine its position
      if (!unreadMessage) {
        const [index, reversedIndex] = this.getMessageIndexes(
          this.unreadMarkerMessageId,
        )

        // Later this will mean we have to make an async call and retrieve the message from iridium
        if (index === -1) return
        const [topIndex] = this.getWindowsIndexes()

        if (index < topIndex) {
          this.trailingIndex = reversedIndex + 1
        } else {
          this.leadingIndex = reversedIndex
        }

        this.$nextTick(() => {
          const unreadMessage = document.querySelector(
            `[data-message-id="${this.unreadMarkerMessageId}"]`,
          ) as HTMLElement

          this.isUnreadAboveViewport = false
          this.isUnreadBelowViewport = false
          this.scrollMessageIntoView(unreadMessage)
        })
        return
      }

      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      this.scrollMessageIntoView(unreadMessage)
    },
    dismissScrollIndicator() {
      if (!this.unreadMarkerMessageId) return

      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      this.currentMarkerMessageId = this.unreadMarkerMessageId
      iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())
    },
    scrollMessageIntoView(el: HTMLElement) {
      const container = (this.$refs.container as ScrollerRef).$el
      const offsetTop = el.offsetTop
      const containerHeight = container.clientHeight
      const scrollTop = offsetTop - containerHeight / 2

      container.scrollTo({
        behavior: 'smooth',
        top: scrollTop,
      })
    },
    getMessageOffsets(id: string) {
      const offsets = { top: 0, bottom: 0 }
      const el = document.querySelector(
        `[data-message-id="${id}"]`,
      ) as HTMLElement | null
      if (el) {
        const elBody = el.querySelector('.body') as HTMLElement

        const currentLastMessage = this.chatItems.find(
          (i) => i.message.id === id,
        )
        offsets.top = // take the offsetTop from the body only if the currentLastMessage does not have to show the header
          elBody && !currentLastMessage?.showHeader
            ? elBody.offsetTop
            : el.offsetTop

        offsets.bottom = offsets.top + el.offsetHeight
      }

      return offsets
    },
    getMessageIndexes(id: string): [number, number] {
      const filtered = this.messages.filter((message) => !message.replyToId)
      const index = filtered.findIndex((item) => item.id === id)
      if (index === -1) return [-1, -1]
      return [index, filtered.length - index - 1]
    },
    getWindowsIndexes(): [number, number] {
      const filtered = this.messages.filter((message) => !message.replyToId)

      return [
        Math.max(filtered.length - this.trailingIndex, 0),
        filtered.length - this.leadingIndex - 1,
      ]
    },
    onBottomReached() {
      if (this.conversationId && !this.isBlurred) {
        iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
