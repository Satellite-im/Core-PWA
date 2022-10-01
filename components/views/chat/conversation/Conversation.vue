<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChevronDownIcon, KeyIcon, FileIcon } from 'satellite-lucide-icons'
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
  },
  data() {
    return {
      numMessages: MESSAGE_PAGE_SIZE,
      isLoadingMore: false,
      isBlurred: false,
      resizeContainerObserver: null as ResizeObserver | null,
      resizeMessagesObserver: null as ResizeObserver | null,
      isLockedToBottom: true,
    }
  },
  computed: {
    ...mapState({
      activeUploadChats: (state) => (state as RootState).chat.activeUploadChats,
    }),
    myDid(): string {
      return iridium.id ?? ''
    },
    conversation(): Conversation {
      return iridium.chat.state.conversations?.[this.$route.params.id] ?? {}
    },
    messages(): ConversationMessage[] {
      if (!Object.keys(this.conversation).length) {
        return []
      }
      return Object.values(this.conversation.message).sort(
        (a, b) => a.at - b.at,
      )
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
          message.at > lastReadAt &&
          (prevMessage ? prevMessage.at <= lastReadAt : true)
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
      const maxTime = Math.max(...this.messages.map((message) => message.at))
      if (
        (!maxTime || maxTime > this.conversation.lastReadAt) &&
        !this.isBlurred
      ) {
        const currentTimestamp = this.$dayjs().valueOf()
        iridium.chat.updateConversationReadAt(
          this.conversation.id,
          maxTime || currentTimestamp,
        )
      }
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
  },
  watch: {
    chatItems(newValue, oldValue) {
      if (
        this.isLastChatItemAuthor &&
        newValue.at(-1)?.message.id !== oldValue.at(-1)?.message.id
      ) {
        this.scrollToBottom()
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
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + 30
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
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
