<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'
import { UIMessage, Group } from '~/types/messaging'
import { getUsernameFromState } from '~/utilities/Messaging'
import { toHTML } from '~/libraries/ui/Markdown'

export default Vue.extend({
  components: {
    PlusSquareIcon,
    MinusSquareIcon,
  },
  props: {
    message: {
      type: Object as PropType<UIMessage>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showReplies: false,
    }
  },
  computed: {
    ...mapState(['ui', 'chat']),
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

      const replies = this.$props.message.replies

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
  mounted() {
    const findItem = this.setChatReply.find(
      (item: any) => item.replyId === this.$props.message.id,
    )

    if (findItem) {
      this.$data.showReplies = findItem.value
    }
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
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
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
     * @param e
     * @example
     */
    showQuickProfile(e: MouseEvent) {
      this.$store.dispatch('ui/showQuickProfile', {
        textilePublicKey: this.$props.message.from,
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

      this.setChatReply = {
        replyId: this.$props.message.id,
        value: this.$data.showReplies,
      }
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
