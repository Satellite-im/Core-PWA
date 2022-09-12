<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { conversationMessageIsNotice } from '~/utilities/chat'

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
      let maxTime = 0
      const messages = this.messages
        .filter((message) => !message.replyToId)
        .slice(-this.numMessages)
        .map((message, index) => {
          const prevMessage = index >= 0 ? this.messages[index - 1] : undefined
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
          maxTime = Math.max(maxTime, message.at)
          const showHeader =
            !isSameAuthor ||
            (prevMessage && conversationMessageIsNotice(prevMessage)) ||
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
      return messages.reverse()
    },
    isLastChatItemAuthor(): boolean {
      const lastItem = this.chatItems.at(0)
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
    window.addEventListener('blur', async () => {
      this.isBlurred = true
    })
    window.addEventListener('focus', async () => {
      this.isBlurred = false
    })
    const container = this.$refs.container as HTMLElement
    if (!container) {
      return
    }
    container.addEventListener('scroll', () => {
      this.isLockedToBottom = container.scrollTop >= 0
    })
    this.mutationObserver = new MutationObserver(() => {
      if (this.isLockedToBottom || this.isLastChatItemAuthor) {
        container.scrollTo(0, 0)
      }
    })
    this.mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  },
  beforeDestroy() {
    this.mutationObserver?.disconnect()
  },
  methods: {
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
