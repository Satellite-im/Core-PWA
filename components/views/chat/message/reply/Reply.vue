<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'

import { mapState } from 'vuex'
import { PlusSquareIcon, MinusSquareIcon } from 'satellite-lucide-icons'

import { UIMessage, Group } from '~/types/messaging'
import {
  getUsernameFromState,
  getFullUserInfoFromState,
} from '~/utilities/Messaging'

export default Vue.extend({
  components: {
    VueMarkdown,
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
    return { showReplies: false, replyHover: '' }
  },
  mounted() {
    const findItem = this.setChatReply.find(
      (item: any) => item.replyId === this.$props.message.id,
    )

    if (findItem) {
      this.$data.showReplies = findItem.value
    }
  },
  computed: {
    ...mapState(['chat']),
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
      const replyLength = Object.keys(this.$props.message.replies).length
      const baseReply = replyLength > 1 ? 'Replies from ' : 'Reply from '

      const getNamesList = (
        replies: any[],
        limit = 2,
        initialText = '',
        separator = ' and ',
      ) =>
        replies
          .slice(0, limit)
          .reduce(
            (text, reply, i) =>
              text +
              (i > 0 && i < limit ? separator : '') +
              getUsernameFromState(reply.from, this.$store.state),
            initialText,
          )

      const names = getNamesList(this.$props.message.replies, 2, baseReply)

      return replyLength > 2
        ? `${names} and ${replyLength - 2} more ...`
        : names
    },
  },
  methods: {
    getUsernameFromReply(reply: any) {
      return getUsernameFromState(reply.from, this.$store.state)
    },
    /**
     * @method mouseOver DocsTODO
     * @description
     * @param replyId
     * @example
     */
    mouseOver(replyId: string) {
      this.$data.replyHover = replyId
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
        show: true,
        floating: !!this.$device.isMobile,
        position: [e.clientX, e.clientY],
        containerWidth: this.$el.clientWidth,
      })
    },
    /**
     * @method showQuickProfile DocsTODO
     * @description
     * @param e
     * @example
     */
    showQuickProfile(e: Event) {
      const selectedUser = getFullUserInfoFromState(
        this.$props.message.from,
        this.$store.state,
      )
      this.$store.commit('ui/setQuickProfilePosition', e)
      this.$store.commit('ui/quickProfile', selectedUser)
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
