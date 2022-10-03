<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
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

export interface ChatItem {
  message: ConversationMessage
  showHeader: boolean
  timeDiff: number
  isNextDay: boolean
  isFirstUnreadMessage: boolean
  replies: ConversationMessage[]
  isLastCallMessage: boolean
}

const MESSAGE_PAGE_SIZE = 50

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
      numMessages: MESSAGE_PAGE_SIZE,
      isLoadingMore: false,
      isBlurred: false,
      resizeContainerObserver: null as ResizeObserver | null,
      resizeMessagesObserver: null as ResizeObserver | null,
      isLockedToBottom: true,
      firstUnreadMessageElement: null as HTMLElement | null,
      lastScrolledToUnreadMessageElement: null as HTMLElement | null,
      isUnreadAboveViewport: false,
      isUnreadBelowViewport: false,
      unreadMarkerMessageId: null as string | null,
    }
  },
  computed: {
    ...mapState({
      activeUploadChats: (state) => (state as RootState).chat.activeUploadChats,
    }),
    ...mapGetters({
      getTimestamp: 'settings/getTimestamp',
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
    hasUnreadMessages(): boolean {
      const lastMessage = Object.values(this.conversation.message)
        .sort((a, b) => a.at - b.at)
        .at(-1)
      if (!lastMessage) {
        return false
      }
      return lastMessage.at > this.conversation.lastReadAt
    },
    chatItems(): ChatItem[] {
      const messages = this.messages
        .filter((message) => !message.replyToId)
        .slice(-this.numMessages)
      const items = messages.map((message, index) => {
        const prevMessage = index >= 0 ? messages[index - 1] : undefined
        const isSameAuthor = prevMessage
          ? message.from === prevMessage.from
          : false
        const timeDiff = prevMessage ? message.at - prevMessage.at : 0
        const isNextDay = prevMessage
          ? !this.$dayjs(prevMessage.at).isSame(message.at, 'day')
          : false
        const lastReadAt = this.conversation.lastReadAt
        const isFirstUnreadMessage =
          !message.status &&
          message.at > lastReadAt &&
          (prevMessage ? prevMessage.at <= lastReadAt : true)
        if (isFirstUnreadMessage) {
          this.unreadMarkerMessageId = message.id
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
      const lastItem = this.chatItems.at(-1)
      if (!lastItem || !iridium.connector) {
        return false
      }
      return lastItem.message.from === iridium.connector.id
    },
    noMore(): boolean {
      return (
        this.numMessages >=
        this.messages.filter((message) => !message.replyToId).length
      )
    },
    numUnread(): number {
      const firstUnreadIndex = this.messages.findIndex(
        (item) => item.id === this.unreadMarkerMessageId,
      )
      return this.messages.length - firstUnreadIndex
    },
    unreadSince(): string | null {
      const message = this.chatItems.find(
        (item) => item.isFirstUnreadMessage,
      )?.message
      if (message) {
        return this.getTimestamp({ time: message.at })
      }
      return null
    },
  },
  watch: {
    chatItems(newValue, oldValue) {
      if (
        this.isLastChatItemAuthor &&
        newValue.at(-1)?.message.id !== oldValue.at(-1)?.message.id
      ) {
        this.scrollToBottom()
      }
      const maxTime = Math.max(...this.messages.map((message) => message.at))
      if (
        oldValue.at(-1) !== newValue.at(-1) &&
        (!maxTime || maxTime > this.conversation.lastReadAt) &&
        !this.isBlurred &&
        this.isLockedToBottom
      ) {
        const currentTimestamp = this.$dayjs().valueOf()
        iridium.chat.updateConversationReadAt(
          this.conversation.id,
          maxTime || currentTimestamp,
        )
      }
    },
    isLastChatItemAuthor(newValue) {
      if (newValue) {
        this.unreadMarkerMessageId = null
      }
    },
  },
  mounted() {
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)
    const container = this.$refs.container as HTMLElement
    const messages = this.$refs.messages as HTMLElement
    if (!container || !messages) {
      return
    }
    container.addEventListener('scroll', () => {
      this.isLockedToBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 1
    })
    this.resizeContainerObserver = new ResizeObserver(() => {
      if (this.isLockedToBottom) {
        this.scrollToBottom()
      }
    })
    this.resizeContainerObserver.observe(container)
    this.resizeMessagesObserver = new ResizeObserver(() => {
      if (this.isLockedToBottom) {
        this.scrollToBottom()
      }
    })
    this.resizeMessagesObserver.observe(messages)
    iridium.chat.updateConversationReadAt(
      this.conversation.id,
      Math.max(...this.messages.map((message) => message.at)),
    )
  },
  beforeDestroy() {
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)
    this.resizeContainerObserver?.disconnect()
    this.resizeMessagesObserver?.disconnect()
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.container as HTMLElement
        container.scrollTop = container.scrollHeight
      })
    },
    handleBlur() {
      this.isBlurred = true
    },
    handleFocus() {
      this.isBlurred = false
    },
    loadMore() {
      // TODO: we'll want to instead call iridium in this method once paginated
      // fetching is added, for now we'll just take a slice.
      this.isLoadingMore = true
      setTimeout(() => {
        this.numMessages += MESSAGE_PAGE_SIZE
        this.isLoadingMore = false
      }, 200)
    },
    onUnreadMessage({
      message,
      messageEl,
      isAboveViewport,
      isBelowViewport,
    }: {
      message: ConversationMessage
      messageEl: HTMLElement
      isAboveViewport: boolean
      isBelowViewport: boolean
    }) {
      this.firstUnreadMessageElement = messageEl
      if (this.lastScrolledToUnreadMessageElement === messageEl) {
        this.isUnreadAboveViewport = false
        this.isUnreadBelowViewport = false
        return
      }
      this.isUnreadAboveViewport = isAboveViewport
      this.isUnreadBelowViewport = isBelowViewport
    },
    scrollUnreadIntoView() {
      if (!this.firstUnreadMessageElement) {
        return
      }
      const container = this.$refs.container as HTMLElement
      const offsetTop = this.firstUnreadMessageElement.offsetTop
      const containerHeight = container.clientHeight
      const scrollTop = offsetTop - containerHeight / 2
      this.lastScrolledToUnreadMessageElement = this.firstUnreadMessageElement
      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      iridium.chat.updateConversationReadAt(
        this.conversation.id,
        Math.max(...this.messages.map((message) => message.at)),
      )

      container.scrollTo({
        behavior: 'smooth',
        top: scrollTop,
      })
    },
    dismissScrollIndicator() {
      this.lastScrolledToUnreadMessageElement = this.firstUnreadMessageElement
      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      iridium.chat.updateConversationReadAt(
        this.conversation.id,
        Math.max(...this.messages.map((message) => message.at)),
      )
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
