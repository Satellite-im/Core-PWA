<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

interface ChatItem {
  message: ConversationMessage
  isSameAuthor: boolean
  timeDiff: number
  isNextDay: boolean
  isFirstUnreadMessage: boolean
  replies: ConversationMessage[]
}

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      conversation:
        iridium.chat.state.conversations?.[this.$route.params.id] ?? {},
    }
  },
  computed: {
    myDid(): string {
      return iridium.connector?.id ?? ''
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
      return this.messages
        .filter((message) => !message.replyToId)
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

          return {
            message,
            isSameAuthor,
            timeDiff,
            isNextDay,
            isFirstUnreadMessage,
            replies,
          }
        })
    },
  },
  methods: {},
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
