<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

interface ChatItem {
  message: ConversationMessage
  isSameAuthor: boolean
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
      chat: iridium.chat.state,
      numMessages: MESSAGE_PAGE_SIZE,
      isLoadingMore: false,
      isBlurred: false,
    }
  },
  computed: {
    myDid(): string {
      return iridium.connector?.id ?? ''
    },
    conversation(): Conversation {
      return this.chat.conversations?.[this.$route.params.id] ?? {}
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

          return {
            message,
            isSameAuthor,
            timeDiff,
            isNextDay,
            isFirstUnreadMessage,
            replies,
          }
        })
      if (maxTime > this.conversation.lastReadAt && !this.isBlurred) {
        iridium.chat.updateConversationReadAt(this.conversation.id, maxTime)
      }
      return messages
    },
    noMore(): boolean {
      return (
        this.numMessages >=
        this.messages.filter((message) => !message.replyToId).length
      )
    },
  },
  async mounted() {
    window.addEventListener('blur', async () => {
      this.isBlurred = true
    })
    window.addEventListener('focus', async () => {
      this.isBlurred = false
    })
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
