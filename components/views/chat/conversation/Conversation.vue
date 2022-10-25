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
import { ScrollerRef } from '~/components/ui/Chat/InfiniteScroll/InfiniteScroll.vue'

export interface ChatItem {
  message: ConversationMessage
  showHeader: boolean
  timeDiff: number
  isNextDay: boolean
  isFirstUnreadMessage: boolean
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
      const sortedMessages = Object.values(this.conversation.message).sort(
        (a, b) => a.at - b.at,
      )
      const lastMessage = sortedMessages[sortedMessages.length - 1]
      if (!lastMessage) {
        return false
      }
      return lastMessage.at > this.conversation.lastReadAt
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
      const lastItem = this.messages[this.messages.length - 1]
      if (!lastItem || !iridium.connector) {
        return false
      }
      return lastItem.from === iridium.connector.id
    },
    noMore(): boolean {
      return (
        this.trailingIndex >=
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
    messageWindow(): number {
      return this.trailingIndex - this.leadingIndex
    },
    noLeading(): boolean {
      return this.leadingIndex === 0
    },
  },
  watch: {
    messages(newValue, oldValue) {
      const scroller = this.$refs.container as ScrollerRef
      if (newValue.length !== oldValue.length) {
        if (this.isLastChatItemAuthor || scroller.isLockedToBottom) {
          scroller.scrollToBottom()
        }

        // if (this.trailingIndex < MESSAGES_WINDOW) {
        //   this.trailingIndex++
        // }
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

    // todo - fix type definition, can be undefined on mobile
    if (this.conversationId) {
      iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())
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
            this.leadingIndex += MESSAGE_PAGE_SIZE
          }
        })
      }, Math.random() * 1000)
    },
    loadLess() {
      this.isLoadingMore = true
      const firstMessage = this.chatItems[this.chatItems.length - 1]?.message.id
      // These should be cached, so hopefully this will be almost instant
      setTimeout(() => {
        this.trailingIndex -= MESSAGE_PAGE_SIZE
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

          this.leadingIndex -= MESSAGE_PAGE_SIZE
        })
      }, 100)
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
      const container = (this.$refs.container as ScrollerRef).$el
      const offsetTop = this.firstUnreadMessageElement.offsetTop
      const containerHeight = container.clientHeight
      const scrollTop = offsetTop - containerHeight / 2
      this.lastScrolledToUnreadMessageElement = this.firstUnreadMessageElement
      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())

      container.scrollTo({
        behavior: 'smooth',
        top: scrollTop,
      })
    },
    dismissScrollIndicator() {
      this.lastScrolledToUnreadMessageElement = this.firstUnreadMessageElement
      this.isUnreadAboveViewport = false
      this.isUnreadBelowViewport = false
      iridium.chat.updateConversationReadAt(this.conversation.id, Date.now())
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
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
