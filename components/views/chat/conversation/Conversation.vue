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

interface ChatItem {
  message: ConversationMessage
  showHeader: boolean
  timeDiff: number
  isNextDay: boolean
  isFirstUnreadMessage: boolean
  replies: ConversationMessage[]
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
      mutationObserver: null as MutationObserver | null,
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
          !isSameAuthor ||
          (prevMessage && conversationMessageIsNotice(prevMessage)) ||
          this.$dayjs.duration(timeDiff).minutes() >= 5 ||
          isNextDay ||
          false

        return {
          message,
          showHeader,
          timeDiff,
          isNextDay,
          isFirstUnreadMessage,
          replies,
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
  mounted() {
    window.addEventListener('blur', this.handleBlur)
    window.addEventListener('focus', this.handleFocus)
    const container = this.$refs.container as HTMLElement
    if (!container) {
      return
    }
    container.addEventListener('scroll', () => {
      this.isLockedToBottom =
        container.scrollTop === container.scrollHeight - container.clientHeight
    })
    const scrollToBottom = () => {
      const y = container.scrollHeight - container.clientHeight
      container.scrollTo(0, y)
    }
    scrollToBottom()
    this.mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        const target = record.target as HTMLElement
        if (
          target.classList.contains('messages') &&
          (this.isLockedToBottom || this.isLastChatItemAuthor)
        ) {
          scrollToBottom()
        }
      })
    })
    this.mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    })
  },
  beforeDestroy() {
    window.removeEventListener('blur', this.handleBlur)
    window.removeEventListener('focus', this.handleFocus)
    this.mutationObserver?.disconnect()
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
      setTimeout(() => {
        this.numMessages += MESSAGE_PAGE_SIZE
        this.isLoadingMore = false
      }, 200)
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
