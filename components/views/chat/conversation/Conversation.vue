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

const MESSAGE_PAGE_SIZE = 50

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      conversation:
        iridium.chat.state.conversations?.[this.$route.params.id] ?? {},
      numMessages: MESSAGE_PAGE_SIZE,
      isLoadingMore: false,
    }
  },
  computed: {
    myDid(): string {
      return iridium.connector?.id ?? ''
    },
    messages(): ConversationMessage[] {
      if (
        !Object.keys(iridium.chat.state.conversations?.[this.$route.params.id])
          .length
      ) {
        return []
      }
      return Object.values(
        iridium.chat.state.conversations?.[this.$route.params.id].message,
      ).sort((a, b) => a.at - b.at)
    },
    chatItems(): ChatItem[] {
      return this.messages
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
          const lastReadAt =
            iridium.chat.state.conversations?.[this.$route.params.id].lastReadAt
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
    noMore(): boolean {
      return (
        this.numMessages >=
        this.messages.filter((message) => !message.replyToId).length
      )
    },
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
