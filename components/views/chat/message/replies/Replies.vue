<template src="./Replies.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import { RootState } from '~/types/store/store'
import { ChatReply } from '~/store/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

interface ReplyItem {
  message: ConversationMessage
  isSameAuthor: boolean
}

export default Vue.extend({
  components: {
    PlusSquareIcon,
    MinusSquareIcon,
  },
  props: {
    replies: {
      type: Array as PropType<ConversationMessage[]>,
      required: true,
    },
  },
  data() {
    return {
      showReplies: false,
    }
  },
  computed: {
    ...mapState({
      chat: (state) => (state as RootState).chat,
    }),
    replyItems(): ReplyItem[] {
      return this.replies.map((message, index) => {
        const prevMessage = index >= 0 ? this.replies[index - 1] : undefined
        const isSameAuthor = prevMessage
          ? message.from === prevMessage.from
          : false
        return {
          message,
          isSameAuthor,
        }
      })
    },
    setChatReply: {
      set(state) {
        this.$store.commit('chat/setChatReply', state)
      },
      get(): ChatReply[] {
        return this.chat.replies
      },
    },
    accordionText(): string {
      const uniqueRepliers = [
        ...new Set(this.replies.map((reply) => reply.from)),
      ].map((r) => iridium.users.getUser(r)?.name)
      return this.$tc('conversation.repliers', uniqueRepliers.length, {
        names: uniqueRepliers.join(', '),
      })
    },
  },
  methods: {
    /**
     * @method toggleReplies DocsTODO
     * @description
     * @example
     */
    toggleReplies() {
      this.showReplies = !this.showReplies
    },
  },
})
</script>
<style lang="less" src="./Replies.less"></style>
