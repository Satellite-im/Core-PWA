<template src="./Replies.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'
import { getUsernameFromState } from '~/utilities/Messaging'
import { toHTML } from '~/libraries/ui/Markdown'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

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
    ...mapState(['ui', 'chat']),
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
      get() {
        return this.chat.replies
      },
    },
    /**
     * makeReplyText: generates the "Replies from _____" text in a chat
     * depending on the number of users in the reply thread, it will generate a different replyText
     */
    makeReplyText() {
      const LIMIT = 2
      const SEPARATOR = this.$t('conversation.replies_separator')

      const replies = this.replies

      const uniqueRepliers = [
        ...new Set(replies.map((reply: any) => reply.from)),
      ]

      const names = uniqueRepliers
        .slice(0, LIMIT)
        .map((replier) =>
          getUsernameFromState(replier as string, this.$store.state),
        )
        .join(SEPARATOR as string)

      if (replies.length === 1) {
        return this.$t('conversation.reply_single', {
          name: names,
        })
      }

      if (uniqueRepliers.length <= LIMIT) {
        return this.$t('conversation.repliers_less_than_limit', {
          names,
        })
      }

      return this.$t('conversation.repliers_more_than_limit', {
        names,
        leftCount: uniqueRepliers.length - LIMIT,
      })
    },
  },
  methods: {
    /**
     * @method markdownToHtml
     * @description convert text markdown to html
     * @param str String to convert
     */
    markdownToHtml(text: string) {
      return toHTML(text, { liveTyping: false })
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @param replyId
     * @example
     */
    emojiReaction(e: MouseEvent, replyID: string) {
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: replyID,
        to:
          this.$props.message.to === myTextilePublicKey
            ? this.$props.message.from
            : this.$props.message.to,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
    },
    /**
     * @method showQuickProfile DocsTODO
     * @description
     * @param {MouseEvent} e - Click event
     * @param {string} textilePublicKey - The author of reply
     * @example
     */
    showQuickProfile(e: MouseEvent, textilePublicKey: string) {
      this.$store.dispatch('ui/showQuickProfile', {
        textilePublicKey,
        position: { x: e.x, y: e.y },
      })
    },
    /**
     * @method toggleReplies DocsTODO
     * @description
     * @example
     */
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies

      //       this.setChatReply = {
      //         replyId: this.$props.message.id,
      //         value: this.$data.showReplies,
      //       }
    },
  },
})
</script>
<style lang="less" src="./Replies.less"></style>
