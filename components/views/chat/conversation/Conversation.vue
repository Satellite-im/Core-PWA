<template src="./Conversation.html"></template>
<script lang="ts">
import Vue from 'vue'
import { ChevronDownIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

interface ChatItem {
  message: ConversationMessage & { id: string }
  isSameAuthor: boolean
  timeDiff: number
  isNextDay: boolean
  isFirstUnreadMessage: boolean
}

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      messages: iridium.chat.messages[this.$route.params.id],
      conversation: iridium.chat.state.conversations[this.$route.params.id],
    }
  },
  computed: {
    myDid(): string {
      return iridium.connector?.id ?? ''
    },
    chatItems(): ChatItem[] {
      return this.messages.map((message, index) => {
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

        return {
          message,
          isSameAuthor,
          timeDiff,
          isNextDay,
          isFirstUnreadMessage,
        }
      })
    },
  },
  async mounted() {
    const conversation = await iridium.chat?.getConversation(
      this.$route.params.address,
    )

    console.log('conversation', conversation)

    if (!conversation) {
      return
    }

    const recipient = conversation.participants.find(
      (p) => p.did !== iridium.profile.state.did,
    )

    console.log('conversation recipient', recipient)

    if (!recipient) {
      return
    }

    iridium.webRTC.subscribeToChannel(recipient.peerId)
  },
  methods: {},
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
